import Link from "next/link";
import type { PartnerListItem } from "@/lib/supabase/partners";
import { DeletePartnerButton } from "@/components/admin/DeletePartnerButton";
import { TogglePartnerButton } from "@/components/admin/TogglePartnerButton";

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

function PartnerThumb({ partner }: { partner: PartnerListItem }) {
  if (partner.image_url) {
    return (
      <img
        src={partner.image_url}
        alt=""
        loading="lazy"
        className="h-9 w-14 shrink-0 rounded-md border border-zinc-200 bg-white object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-14 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-sm font-semibold text-white"
    >
      {partner.name.trim().charAt(0).toUpperCase() || "P"}
    </span>
  );
}

function ActionButtons({
  id,
  name,
  isActive,
}: {
  id: string;
  name: string;
  isActive: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <TogglePartnerButton id={id} name={name} isActive={isActive} />
      <Link
        href={`/admin/partners/${id}/edit`}
        aria-label={`Editar ${name}`}
        className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        Editar
      </Link>
      <DeletePartnerButton id={id} name={name} />
    </span>
  );
}

export function PartnersList({ partners }: { partners: PartnerListItem[] }) {
  return (
    <div>
      {/* Tabela desktop */}
      <div className="hidden overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[880px] border-collapse text-left text-sm">
          <caption className="sr-only">Parceiros cadastrados no TremBoom</caption>
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <th scope="col" className="px-4 py-3 font-medium">
                Parceiro
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Slug
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Categoria
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Ordem
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
            {partners.map((partner) => (
              <tr
                key={partner.id}
                className="transition-colors hover:bg-zinc-50"
              >
                <td className="px-4 py-3">
                  <span className="flex items-center gap-3">
                    <PartnerThumb partner={partner} />
                    <span className="font-medium text-zinc-900">
                      {partner.name}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                  {partner.slug}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {partner.category ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge active={partner.is_active} />
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {partner.display_order ?? "—"}
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {formatDate(partner.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <ActionButtons
                    id={partner.id}
                    name={partner.name}
                    isActive={partner.is_active ?? false}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <ul className="space-y-3 md:hidden">
        {partners.map((partner) => (
          <li
            key={partner.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <PartnerThumb partner={partner} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-900">
                  {partner.name}
                </p>
                <p className="truncate font-mono text-xs text-zinc-500">
                  {partner.slug}
                </p>
              </div>
              <StatusBadge active={partner.is_active} />
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div>
                <dt className="text-zinc-500">Categoria</dt>
                <dd className="mt-0.5 truncate font-medium text-zinc-800">
                  {partner.category ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Ordem</dt>
                <dd className="mt-0.5 font-medium text-zinc-800">
                  {partner.display_order ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Criado em</dt>
                <dd className="mt-0.5 font-medium text-zinc-800">
                  {formatDate(partner.created_at)}
                </dd>
              </div>
            </dl>
            <div className="mt-3 flex items-center justify-end border-t border-zinc-100 pt-3">
              <ActionButtons
                id={partner.id}
                name={partner.name}
                isActive={partner.is_active ?? false}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
