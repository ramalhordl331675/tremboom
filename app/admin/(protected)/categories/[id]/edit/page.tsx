import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategoryById } from "@/lib/supabase/categories";

export default async function AdminCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id).catch(() => null);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/categories"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          ← Voltar para categorias
        </Link>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Editar categoria
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Altere os dados de “{category.name}”.
        </p>
      </div>

      <CategoryForm category={category} />
    </div>
  );
}
