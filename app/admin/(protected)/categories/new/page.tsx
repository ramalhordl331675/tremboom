import Link from "next/link";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function AdminCategoryNewPage() {
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
          Nova categoria
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Cadastre uma nova categoria para organizar os produtos.
        </p>
      </div>

      <CategoryForm />
    </div>
  );
}
