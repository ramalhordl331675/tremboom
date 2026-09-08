import Link from "next/link";
import type { CategoryDetails } from "@/lib/supabase/categories";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function StatusBadge({ active }: { active: boolean | null }) {
  if (active === null) {
    return (
      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
        —
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        active ? "bg-green-100 text-green-800" : "bg-zinc-200 text-zinc-700"
      }`}
    >
      {active ? "Ativa" : "Inativa"}
    </span>
  );
}

export function CategoriesList({
  categories,
}: {
  categories: CategoryDetails[];
}) {
  return (
    <div>
      {/* Tabela desktop */}
      <div className="hidden overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <caption className="sr-only">
            Categorias cadastradas no TremBoom
          </caption>
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <th scope="col" className="px-4 py-3 font-medium">
                Categoria
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Slug
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Posição
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Criada em
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {categories.map((category) => (
              <tr key={category.id} className="transition-colors hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-sm font-semibold text-white"
                    >
                      {category.name.trim().charAt(0).toUpperCase() || "C"}
                    </span>
                    <span className="font-medium text-zinc-900">
                      {category.name}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                  {category.slug}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge active={category.is_active} />
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {category.position ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                  {formatDate(category.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-2">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                    >
                      Editar
                    </Link>
                    <DeleteCategoryButton id={category.id} name={category.name} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <ul className="space-y-3 md:hidden">
        {categories.map((category) => (
          <li
            key={category.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-sm font-semibold text-white"
              >
                {category.name.trim().charAt(0).toUpperCase() || "C"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-900">
                  {category.name}
                </p>
                <p className="truncate font-mono text-xs text-zinc-500">
                  {category.slug}
                </p>
              </div>
              <StatusBadge active={category.is_active} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="text-xs text-zinc-500">
                Pos. {category.position ?? "—"} · {formatDate(category.created_at)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Link
                  href={`/admin/categories/${category.id}/edit`}
                  aria-label={`Editar ${category.name}`}
                  className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600"
                >
                  Editar
                </Link>
                <DeleteCategoryButton id={category.id} name={category.name} />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
