import { createClient } from "@/lib/supabase/server";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type CategoryDetails = Category & {
  description: string | null;
  image_url: string | null;
  is_active: boolean | null;
  position: number | null;
  created_at: string | null;
  updated_at: string | null;
};

const CATEGORY_DETAILS_COLUMNS =
  "id,name,slug,description,image_url,is_active,position,created_at,updated_at";

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug")
    .eq("is_active", true)
    .order("position", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error("LOAD_CATEGORIES_FAILED");
  }

  return (data ?? []) as Category[];
}

export async function getCategories(): Promise<CategoryDetails[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_DETAILS_COLUMNS)
    .order("position", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error("LOAD_CATEGORIES_FAILED");
  }

  return (data ?? []) as CategoryDetails[];
}

export async function getCategoryById(
  id: string
): Promise<CategoryDetails | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_DETAILS_COLUMNS)
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("LOAD_CATEGORY_FAILED");
  }

  return (data ?? null) as CategoryDetails | null;
}
