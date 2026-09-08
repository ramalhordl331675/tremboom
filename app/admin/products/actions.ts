"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SLUG_RE, isHttpsUrl, isValidUrl } from "@/lib/platform-utils";

export type ProductFormErrors = {
  name?: string;
  slug?: string;
  description?: string;
  category_id?: string;
  platform_id?: string;
  price?: string;
  old_price?: string;
  image_url?: string;
  affiliate_url?: string;
  highlight_text?: string;
  rating?: string;
  position?: string;
  form?: string;
};

export type ProductFormState = {
  ok: boolean;
  errors: ProductFormErrors;
  values: Record<string, string>;
};

type ParsedProduct = {
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
  platform_id: string | null;
  image_url: string | null;
  price: number;
  old_price: number | null;
  affiliate_url: string;
  highlight_text: string | null;
  rating: number | null;
  is_featured: boolean;
  is_active: boolean;
  position: number;
};

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

// "19,90" / "1.299,90" -> 19.90 / 1299.90 ; "19.90" mantido.
function parseBRL(raw: string): number {
  const cleaned = raw.trim();
  const normalized = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned;
  return Number(normalized);
}

// Validação única usada por create e update (mesmas regras, sem duplicação).
function validateProductForm(formData: FormData): {
  values: Record<string, string>;
  errors: ProductFormErrors;
  parsed: ParsedProduct | null;
} {
  const name = str(formData, "name");
  const slug = str(formData, "slug").toLowerCase();
  const description = str(formData, "description");
  const category_id = str(formData, "category_id");
  const platform_id = str(formData, "platform_id");
  const priceRaw = str(formData, "price");
  const oldPriceRaw = str(formData, "old_price");
  const image_url = str(formData, "image_url");
  const affiliate_url = str(formData, "affiliate_url");
  const highlight_text = str(formData, "highlight_text");
  const ratingRaw = str(formData, "rating");
  const positionRaw = str(formData, "position");
  const is_featured = formData.get("is_featured") === "on";
  const is_active = formData.get("is_active") === "on";

  const values: Record<string, string> = {
    name,
    slug,
    description,
    category_id,
    platform_id,
    price: priceRaw,
    old_price: oldPriceRaw,
    image_url,
    affiliate_url,
    highlight_text,
    rating: ratingRaw,
    position: positionRaw,
  };
  const fail = (errors: ProductFormErrors) => ({ values, errors, parsed: null });

  if (!name) {
    return fail({ name: "Informe o nome do produto." });
  }
  if (!slug) {
    return fail({ slug: "Informe o slug do produto." });
  }
  if (!SLUG_RE.test(slug)) {
    return fail({
      slug: "Use apenas letras minúsculas, números e hífens (ex.: fone-sem-fio).",
    });
  }
  if (!category_id) {
    return fail({ category_id: "Escolha uma categoria." });
  }
  if (!priceRaw) {
    return fail({ price: "Informe o preço do produto." });
  }
  const price = parseBRL(priceRaw);
  if (!Number.isFinite(price) || price < 0) {
    return fail({ price: "Informe um valor válido maior ou igual a zero." });
  }
  const price2 = Math.round(price * 100) / 100;

  let old_price: number | null = null;
  if (oldPriceRaw) {
    old_price = parseBRL(oldPriceRaw);
    if (!Number.isFinite(old_price) || old_price < 0) {
      return fail({ old_price: "Informe um valor válido maior ou igual a zero." });
    }
    old_price = Math.round(old_price * 100) / 100;
    if (old_price < price2) {
      return fail({ old_price: "O preço anterior não pode ser menor que o preço atual." });
    }
  }

  if (image_url) {
    if (!isValidUrl(image_url)) {
      return fail({ image_url: "Informe uma URL válida para a imagem." });
    }
    if (!isHttpsUrl(image_url)) {
      return fail({ image_url: "A URL da imagem precisa começar com https://." });
    }
  }
  if (!affiliate_url) {
    return fail({ affiliate_url: "Informe o link de afiliado do produto." });
  }
  if (!isValidUrl(affiliate_url)) {
    return fail({ affiliate_url: "Informe uma URL válida para o link." });
  }
  if (!isHttpsUrl(affiliate_url)) {
    return fail({ affiliate_url: "O link precisa começar com https://." });
  }

  let rating: number | null = null;
  if (ratingRaw) {
    rating = Number(ratingRaw.replace(",", "."));
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

  return {
    values,
    errors: {},
    parsed: {
      name,
      slug,
      description: description || null,
      category_id,
      platform_id: platform_id || null,
      image_url: image_url || null,
      price: price2,
      old_price,
      affiliate_url,
      highlight_text: highlight_text || null,
      rating,
      is_featured,
      is_active,
      position,
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

async function checkRelations(
  supabase: SupabaseAdmin,
  parsed: ParsedProduct
): Promise<ProductFormErrors | null> {
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("id", parsed.category_id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (!category) {
    return { category_id: "Categoria inválida." };
  }

  if (parsed.platform_id) {
    const { data: platform } = await supabase
      .from("platforms")
      .select("id")
      .eq("id", parsed.platform_id)
      .limit(1)
      .maybeSingle();

    if (!platform) {
      return { platform_id: "Plataforma inválida." };
    }
  }

  return null;
}

async function checkSlugFree(
  supabase: SupabaseAdmin,
  slug: string,
  ignoreId?: string
) {
  let query = supabase.from("products").select("id").eq("slug", slug).limit(1);
  if (ignoreId) {
    query = query.neq("id", ignoreId);
  }
  const { data } = await query.maybeSingle();
  return !data;
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const { values, errors, parsed } = validateProductForm(formData);
  const fail = (e: ProductFormErrors): ProductFormState => ({
    ok: false,
    errors: e,
    values,
  });
  if (!parsed) return fail(errors);

  const supabase = await requireAdmin();
  if (!supabase) {
    return fail({ form: "Sem permissão para criar produtos. Entre novamente." });
  }

  const relationError = await checkRelations(supabase, parsed);
  if (relationError) return fail(relationError);

  if (!(await checkSlugFree(supabase, parsed.slug))) {
    return fail({ slug: "Este slug já está em uso." });
  }

  const { error } = await supabase.from("products").insert({
    name: parsed.name,
    slug: parsed.slug,
    description: parsed.description,
    category_id: parsed.category_id,
    platform_id: parsed.platform_id,
    image_url: parsed.image_url,
    price: parsed.price,
    old_price: parsed.old_price,
    affiliate_url: parsed.affiliate_url,
    highlight_text: parsed.highlight_text,
    rating: parsed.rating,
    is_featured: parsed.is_featured,
    is_active: parsed.is_active,
    position: parsed.position,
  });

  if (error) {
    if (error.code === "23505") {
      return fail({ slug: "Este slug já está em uso." });
    }
    if (error.code === "23503") {
      return fail({ form: "Categoria ou plataforma inválida." });
    }
    return fail({
      form: "Não foi possível salvar o produto.",
    });
  }

  revalidatePath("/admin/products");
  redirect("/admin/products?created=1");
  return { ok: false, errors: {}, values: {} };
}

export async function updateProductAction(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const { values, errors, parsed } = validateProductForm(formData);
  const fail = (e: ProductFormErrors): ProductFormState => ({
    ok: false,
    errors: e,
    values,
  });
  if (!parsed) return fail(errors);

  const supabase = await requireAdmin();
  if (!supabase) {
    return fail({ form: "Sem permissão para editar produtos. Entre novamente." });
  }

  const { data: current } = await supabase
    .from("products")
    .select("id")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (!current) {
    return fail({ form: "Produto não encontrado." });
  }

  const relationError = await checkRelations(supabase, parsed);
  if (relationError) return fail(relationError);

  if (!(await checkSlugFree(supabase, parsed.slug, id))) {
    return fail({ slug: "Este slug já está em uso." });
  }

  const { error } = await supabase
    .from("products")
    .update({
      name: parsed.name,
      slug: parsed.slug,
      description: parsed.description,
      category_id: parsed.category_id,
      platform_id: parsed.platform_id,
      image_url: parsed.image_url,
      price: parsed.price,
      old_price: parsed.old_price,
      affiliate_url: parsed.affiliate_url,
      highlight_text: parsed.highlight_text,
      rating: parsed.rating,
      is_featured: parsed.is_featured,
      is_active: parsed.is_active,
      position: parsed.position,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return fail({ slug: "Este slug já está em uso." });
    }
    if (error.code === "23503") {
      return fail({ form: "Categoria ou plataforma inválida." });
    }
    return fail({
      form: "Não foi possível salvar o produto.",
    });
  }

  revalidatePath("/admin/products");
  redirect("/admin/products?updated=1");
  return { ok: false, errors: {}, values: {} };
}

export async function deleteProductAction(
  id: string
): Promise<{ ok: boolean; message: string }> {
  const supabase = await requireAdmin();
  if (!supabase) {
    return { ok: false, message: "Sem permissão para excluir. Entre novamente." };
  }

  const { data: current } = await supabase
    .from("products")
    .select("id")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (!current) {
    return { ok: false, message: "Produto não encontrado." };
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      return {
        ok: false,
        message: "Este produto está vinculado e não pode ser excluído.",
      };
    }
    return { ok: false, message: "Não foi possível excluir. Tente novamente." };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products?deleted=1");
  return { ok: true, message: "" };
}
