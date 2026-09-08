import Link from "next/link";
import type { ProductListItem } from "@/lib/supabase/products";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

function toNumber(value: number | string | null): number | null {
  if (value === null) return null;
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(parsed) ? parsed : null;
}

function formatBRL(value: number | string | null) {
  const parsed = toNumber(value);
  if (parsed === null) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(parsed);
}

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
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

function ProductThumb({ product }: { product: ProductListItem }) {
  if (product.image_url) {
    return (
      <img
        src={product.image_url}
        alt=""
        loading="lazy"
        className="h-9 w-9 shrink-0 rounded-md border border-zinc-200 bg-white object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-sm font-semibold text-white"
    >
      {product.name.trim().charAt(0).toUpperCase() || "P"}
    </span>
  );
}

function ActionButtons({ id, name }: { id: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Link
        href={`/admin/products/${id}/edit`}
        aria-label={`Editar ${name}`}
        className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        Editar
      </Link>
      <DeleteProductButton id={id} name={name} />
    </span>
  );
}

function boolText(value: boolean | null) {
  if (value === null) return "—";
  return value ? "Sim" : "Não";
}

export function ProductsList({ products }: { products: ProductListItem[] }) {
  return (
    <div>
      {/* Tabela desktop */}
      <div className="hidden overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[1020px] border-collapse text-left text-sm">
          <caption className="sr-only">Produtos cadastrados no TremBoom</caption>
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <th scope="col" className="px-4 py-3 font-medium">
                Produto
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Categoria
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Plataforma
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Preço
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Destaque
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Posição
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Criado em
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {products.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-3">
                    <ProductThumb product={product} />
                    <span className="font-medium text-zinc-900">
                      {product.name}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {product.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {product.platform?.name ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-900">
                  {formatBRL(product.price)}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {boolText(product.is_featured)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge active={product.is_active} />
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {product.position ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                  {formatDate(product.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <ActionButtons id={product.id} name={product.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <ul className="space-y-3 md:hidden">
        {products.map((product) => (
          <li
            key={product.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <ProductThumb product={product} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-900">
                  {product.name}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {[product.category?.name, product.platform?.name]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </p>
              </div>
              <StatusBadge active={product.is_active} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="text-sm font-semibold text-zinc-900">
                {formatBRL(product.price)}
              </span>
              <ActionButtons id={product.id} name={product.name} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
