"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SLUG_RE, isHttpsUrl, isValidUrl } from "@/lib/platform-utils";

export type PartnerFormErrors = {
  name?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  affiliate_url?: string;
  button_text?: string;
  category?: string;
  display_order?: string;
  form?: string;
};

export type PartnerFormState = {
  ok: boolean;
  errors: PartnerFormErrors;
  values: Record<string, string>;
};

type ParsedPartner = {
  name: string;
  slug: string;
  description: string | null;
  image_url: string;
  affiliate_url: string;
  button_text: string | null;
  category: string | null;
  is_active: boolean;
  display_order: number;
};

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

// Validação única usada por create e update (mesmas regras, sem duplicação).
function validatePartnerForm(formData: FormData): {
  values: Record<string, string>;
  errors: PartnerFormErrors;
  parsed: ParsedPartner | null;
} {
  const name = str(formData, "name");
  const slug = str(formData, "slug").toLowerCase();
  const description = str(formData, "description");
  const image_url = str(formData, "image_url");
  const affiliate_url = str(formData, "affiliate_url");
  const button_text = str(formData, "button_text");
  const category = str(formData, "category");
  const displayOrderRaw = str(formData, "display_order");
  const is_active = formData.get("is_active") === "on";

  const values: Record<string, string> = {
    name,
    slug,
    description,
    image_url,
    affiliate_url,
    button_text,
    category,
    display_order: displayOrderRaw,
  };
  const fail = (errors: PartnerFormErrors) => ({ values, errors, parsed: null });

  if (!name) {
    return fail({ name: "Informe o nome do parceiro." });
  }
  if (!slug) {
    return fail({ slug: "Informe o slug do parceiro." });
  }
  if (!SLUG_RE.test(slug)) {
    return fail({
      slug: "Use apenas letras minúsculas, números e hífens (ex.: loja-exemplo).",
    });
  }
  if (!image_url) {
    return fail({ image_url: "Informe a URL da imagem do parceiro." });
  }
  if (!isValidUrl(image_url)) {
    return fail({ image_url: "Informe uma URL válida para a imagem." });
  }
  if (!isHttpsUrl(image_url)) {
    return fail({ image_url: "A URL da imagem precisa começar com https://." });
  }
  if (!affiliate_url) {
    return fail({ affiliate_url: "Informe o link de afiliado do parceiro." });
  }
  if (!isValidUrl(affiliate_url)) {
    return fail({ affiliate_url: "Informe uma URL válida para o link." });
  }
  if (!isHttpsUrl(affiliate_url)) {
    return fail({ affiliate_url: "O link precisa começar com https://." });
  }
  if (button_text.length > 60) {
    return fail({ button_text: "O texto do botão deve ter até 60 caracteres." });
  }

  let display_order = 0;
  if (displayOrderRaw) {
    display_order = Number(displayOrderRaw);
    if (!Number.isInteger(display_order)) {
      return fail({ display_order: "A ordem deve ser um número inteiro." });
    }
  }

  return {
    values,
    errors: {},
    parsed: {
      name,
      slug,
      description: description || null,
      image_url,
      affiliate_url,
      button_text: button_text || null,
      category: category || null,
      is_active,
      display_order,
    },
  };
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return null;
  }
  return supabase;
}

type SupabaseAdmin = NonNullable<Awaited<ReturnType<typeof requireAdmin>>>;

async function checkSlugFree(
  supabase: SupabaseAdmin,
  slug: string,
  ignoreId?: string
) {
  let query = supabase.from("partners").select("id").eq("slug", slug).limit(1);
  if (ignoreId) {
    query = query.neq("id", ignoreId);
  }
  const { data } = await query.maybeSingle();
  return !data;
}

export async function createPartnerAction(
  _prevState: PartnerFormState,
  formData: FormData
): Promise<PartnerFormState> {
  const { values, errors, parsed } = validatePartnerForm(formData);
  const fail = (e: PartnerFormErrors): PartnerFormState => ({
    ok: false,
    errors: e,
    values,
  });
  if (!parsed) return fail(errors);

  const supabase = await requireAdmin();
  if (!supabase) {
    return fail({ form: "Sem permissão para criar parceiros. Entre novamente." });
  }

  if (!(await checkSlugFree(supabase, parsed.slug))) {
    return fail({ slug: "Este slug já está em uso." });
  }

  const { error } = await supabase.from("partners").insert({
    name: parsed.name,
    slug: parsed.slug,
    description: parsed.description,
    image_url: parsed.image_url,
    affiliate_url: parsed.affiliate_url,
    button_text: parsed.button_text,
    category: parsed.category,
    is_active: parsed.is_active,
    display_order: parsed.display_order,
  });

  if (error) {
    if (error.code === "23505") {
      return fail({ slug: "Este slug já está em uso." });
    }
    return fail({
      form: "Não foi possível salvar o parceiro.",
    });
  }

  revalidatePath("/admin/partners");
  revalidatePath("/");
  redirect("/admin/partners?created=1");
  return { ok: false, errors: {}, values: {} };
}

export async function updatePartnerAction(
  id: string,
  _prevState: PartnerFormState,
  formData: FormData
): Promise<PartnerFormState> {
  const { values, errors, parsed } = validatePartnerForm(formData);
  const fail = (e: PartnerFormErrors): PartnerFormState => ({
    ok: false,
    errors: e,
    values,
  });
  if (!parsed) return fail(errors);

  const supabase = await requireAdmin();
  if (!supabase) {
    return fail({ form: "Sem permissão para editar parceiros. Entre novamente." });
  }

  const { data: current } = await supabase
    .from("partners")
    .select("id")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (!current) {
    return fail({ form: "Parceiro não encontrado." });
  }

  if (!(await checkSlugFree(supabase, parsed.slug, id))) {
    return fail({ slug: "Este slug já está em uso." });
  }

  const { error } = await supabase
    .from("partners")
    .update({
      name: parsed.name,
      slug: parsed.slug,
      description: parsed.description,
      image_url: parsed.image_url,
      affiliate_url: parsed.affiliate_url,
      button_text: parsed.button_text,
      category: parsed.category,
      is_active: parsed.is_active,
      display_order: parsed.display_order,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return fail({ slug: "Este slug já está em uso." });
    }
    return fail({
      form: "Não foi possível salvar o parceiro.",
    });
  }

  revalidatePath("/admin/partners");
  revalidatePath("/");
  redirect("/admin/partners?updated=1");
  return { ok: false, errors: {}, values: {} };
}

export async function togglePartnerActiveAction(
  id: string,
  isActive: boolean
): Promise<{ ok: boolean; message: string }> {
  const supabase = await requireAdmin();
  if (!supabase) {
    return { ok: false, message: "Sem permissão. Entre novamente." };
  }

  const { error } = await supabase
    .from("partners")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return { ok: false, message: "Não foi possível alterar o status." };
  }

  revalidatePath("/admin/partners");
  revalidatePath("/");
  return { ok: true, message: "" };
}

export async function deletePartnerAction(
  id: string
): Promise<{ ok: boolean; message: string }> {
  const supabase = await requireAdmin();
  if (!supabase) {
    return { ok: false, message: "Sem permissão para excluir. Entre novamente." };
  }

  const { data: current } = await supabase
    .from("partners")
    .select("id")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (!current) {
    return { ok: false, message: "Parceiro não encontrado." };
  }

  const { error } = await supabase.from("partners").delete().eq("id", id);

  if (error) {
    return { ok: false, message: "Não foi possível excluir. Tente novamente." };
  }

  revalidatePath("/admin/partners");
  revalidatePath("/");
  redirect("/admin/partners?deleted=1");
  return { ok: true, message: "" };
}
