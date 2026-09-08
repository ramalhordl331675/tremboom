"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SLUG_RE, isHttpsUrl, isValidUrl } from "@/lib/platform-utils";

export type CategoryFormErrors = {
  name?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  position?: string;
  form?: string;
};

export type CategoryFormState = {
  ok: boolean;
  errors: CategoryFormErrors;
  values: Record<string, string>;
};

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
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

function validateCommon(formData: FormData): {
  values: Record<string, string>;
  errors: CategoryFormErrors;
  parsed:
    | {
        name: string;
        slug: string;
        description: string | null;
        image_url: string | null;
        is_active: boolean;
        position: number;
      }
    | null;
} {
  const name = str(formData, "name");
  const slug = str(formData, "slug").toLowerCase();
  const description = str(formData, "description");
  const image_url = str(formData, "image_url");
  const positionRaw = str(formData, "position");
  const is_active = formData.get("is_active") === "on";

  const values: Record<string, string> = {
    name,
    slug,
    description,
    image_url,
    position: positionRaw,
  };
  const fail = (errors: CategoryFormErrors) => ({ values, errors, parsed: null });

  if (!name) {
    return fail({ name: "Informe o nome da categoria." });
  }
  if (!slug) {
    return fail({ slug: "Informe o slug da categoria." });
  }
  if (!SLUG_RE.test(slug)) {
    return fail({
      slug: "Use apenas letras minúsculas, números e hífens (ex.: cozinha).",
    });
  }
  if (image_url) {
    if (!isValidUrl(image_url)) {
      return fail({ image_url: "Informe uma URL válida para a imagem." });
    }
    if (!isHttpsUrl(image_url)) {
      return fail({ image_url: "A URL da imagem precisa começar com https://." });
    }
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
      image_url: image_url || null,
      is_active,
      position,
    },
  };
}

async function checkSlugFree(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slug: string,
  ignoreId?: string
) {
  let query = supabase.from("categories").select("id").eq("slug", slug).limit(1);
  if (ignoreId) {
    query = query.neq("id", ignoreId);
  }
  const { data } = await query.maybeSingle();
  return !data;
}

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const { values, errors, parsed } = validateCommon(formData);
  const fail = (e: CategoryFormErrors): CategoryFormState => ({
    ok: false,
    errors: e,
    values,
  });
  if (!parsed) return fail(errors);

  const supabase = await requireAdmin();
  if (!supabase) {
    return fail({ form: "Sem permissão para criar categorias. Entre novamente." });
  }

  if (!(await checkSlugFree(supabase, parsed.slug))) {
    return fail({ slug: "Este slug já está em uso." });
  }

  const { error } = await supabase.from("categories").insert({
    name: parsed.name,
    slug: parsed.slug,
    description: parsed.description,
    image_url: parsed.image_url,
    is_active: parsed.is_active,
    position: parsed.position,
  });

  if (error) {
    if (error.code === "23505") {
      return fail({ slug: "Este slug já está em uso." });
    }
    return fail({ form: "Não foi possível salvar a categoria." });
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories?created=1");
  return { ok: false, errors: {}, values: {} };
}

export async function updateCategoryAction(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const { values, errors, parsed } = validateCommon(formData);
  const fail = (e: CategoryFormErrors): CategoryFormState => ({
    ok: false,
    errors: e,
    values,
  });
  if (!parsed) return fail(errors);

  const supabase = await requireAdmin();
  if (!supabase) {
    return fail({ form: "Sem permissão para editar categorias. Entre novamente." });
  }

  const { data: current } = await supabase
    .from("categories")
    .select("id")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (!current) {
    return fail({ form: "Categoria não encontrada." });
  }

  if (!(await checkSlugFree(supabase, parsed.slug, id))) {
    return fail({ slug: "Este slug já está em uso." });
  }

  const { error } = await supabase
    .from("categories")
    .update({
      name: parsed.name,
      slug: parsed.slug,
      description: parsed.description,
      image_url: parsed.image_url,
      is_active: parsed.is_active,
      position: parsed.position,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return fail({ slug: "Este slug já está em uso." });
    }
    return fail({ form: "Não foi possível salvar a categoria." });
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories?updated=1");
  return { ok: false, errors: {}, values: {} };
}

export async function deleteCategoryAction(
  id: string
): Promise<{ ok: boolean; message: string }> {
  const supabase = await requireAdmin();
  if (!supabase) {
    return { ok: false, message: "Sem permissão para excluir. Entre novamente." };
  }

  // products.category_id é NOT NULL com ON DELETE RESTRICT: a exclusão
  // destrutiva é bloqueada pelo banco; checamos antes para mensagem clara.
  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) {
    return { ok: false, message: "Não foi possível excluir agora. Tente novamente." };
  }

  if ((count ?? 0) > 0) {
    return {
      ok: false,
      message: `Esta categoria está em uso por ${count} produto(s) e não pode ser excluída.`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      return {
        ok: false,
        message: "Esta categoria está em uso e não pode ser excluída.",
      };
    }
    return { ok: false, message: "Não foi possível excluir. Tente novamente." };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories?deleted=1");
  return { ok: true, message: "" };
}
