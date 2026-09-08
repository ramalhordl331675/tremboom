"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SLUG_RE, isHttpsUrl, isValidUrl } from "@/lib/platform-utils";

export type PlatformFormErrors = {
  name?: string;
  slug?: string;
  logo_url?: string;
  description?: string;
  affiliate_url?: string;
  bonus_text?: string;
  rating?: string;
  position?: string;
  form?: string;
};

export type PlatformFormState = {
  ok: boolean;
  errors: PlatformFormErrors;
  values: Record<string, string>;
};

const INITIAL_STATE: PlatformFormState = { ok: false, errors: {}, values: {} };

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function createPlatformAction(
  _prevState: PlatformFormState,
  formData: FormData
): Promise<PlatformFormState> {
  const name = str(formData, "name");
  const slug = str(formData, "slug").toLowerCase();
  const logo_url = str(formData, "logo_url");
  const description = str(formData, "description");
  const affiliate_url = str(formData, "affiliate_url");
  const bonus_text = str(formData, "bonus_text");
  const ratingRaw = str(formData, "rating");
  const positionRaw = str(formData, "position");
  const is_featured = formData.get("is_featured") === "on";
  const is_active = formData.get("is_active") === "on";

  const values: Record<string, string> = {
    name,
    slug,
    logo_url,
    description,
    affiliate_url,
    bonus_text,
    rating: ratingRaw,
    position: positionRaw,
  };
  const fail = (errors: PlatformFormErrors): PlatformFormState => ({
    ok: false,
    errors,
    values,
  });

  if (!name) {
    return fail({ name: "Informe o nome da plataforma." });
  }
  if (!slug) {
    return fail({ slug: "Informe o slug da plataforma." });
  }
  if (!SLUG_RE.test(slug)) {
    return fail({
      slug: "Use apenas letras minúsculas, números e hífens (ex.: betboom-brasil).",
    });
  }
  if (logo_url) {
    if (!isValidUrl(logo_url)) {
      return fail({ logo_url: "Informe uma URL válida para a logo." });
    }
    if (!isHttpsUrl(logo_url)) {
      return fail({ logo_url: "A URL da logo precisa começar com https://." });
    }
  }
  if (affiliate_url) {
    if (!isValidUrl(affiliate_url)) {
      return fail({ affiliate_url: "Informe uma URL válida para o link." });
    }
    if (!isHttpsUrl(affiliate_url)) {
      return fail({ affiliate_url: "O link precisa começar com https://." });
    }
  }
  if (bonus_text.length > 120) {
    return fail({ bonus_text: "O texto de bônus deve ter até 120 caracteres." });
  }

  let rating: number | null = null;
  if (ratingRaw) {
    rating = Number(ratingRaw);
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      return fail({ rating: "A avaliação deve estar entre 0 e 5." });
    }
    rating = Math.round(rating * 10) / 10;
  }

  let position = 0;
  if (positionRaw) {
    position = Number(positionRaw);
    if (!Number.isInteger(position)) {
      return fail({ position: "A posição deve ser um número inteiro." });
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return fail({
      form: "Sem permissão para criar plataformas. Entre novamente.",
    });
  }

  const { data: existing } = await supabase
    .from("platforms")
    .select("id")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return fail({ slug: "Este slug já está em uso. Escolha outro." });
  }

  const { error } = await supabase.from("platforms").insert({
    name,
    slug,
    logo_url: logo_url || null,
    description: description || null,
    affiliate_url: affiliate_url || null,
    bonus_text: bonus_text || null,
    rating,
    is_featured,
    is_active,
    position,
  });

  if (error) {
    // Conflito de slug em condição de corrida (UNIQUE).
    if (error.code === "23505") {
      return fail({ slug: "Este slug já está em uso. Escolha outro." });
    }
    return fail({
      form: "Não foi possível salvar. Tente novamente em instantes.",
    });
  }

  revalidatePath("/admin/platforms");
  redirect("/admin/platforms?created=1");
  return INITIAL_STATE;
}
