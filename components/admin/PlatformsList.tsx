import type { Platform } from "@/lib/supabase/platforms";

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

function formatRating(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "—";
  return value.toFixed(1).replace(".", ",");
}

function statusInfo(platform: Platform): {
  label: string;
  tone: "active" | "inactive" | "neutral";
} {
  if (typeof platform.is_active === "boolean") {
    return platform.is_active
      ? { label: "Ativa", tone: "active" }
      : { label: "Inativa", tone: "inactive" };
  }
  return { label: "—", tone: "neutral" };
}

function StatusBadge({ platform }: { platform: Platform }) {
  const { label, tone } = statusInfo(platform);
  const classes =
    tone === "active"
      ? "bg-green-100 text-green-800"
      : tone === "inactive"
        ? "bg-zinc-200 text-zinc-700"
        : "bg-zinc-100 text-zinc-500";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}

function PlatformLogo({ platform }: { platform: Platform }) {
  const src = platform.logo_url;
  if (src) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        className="h-9 w-9 shrink-0 rounded-md border border-zinc-200 bg-white object-contain"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-sm font-semibold text-white"
    >
      {platform.name.trim().charAt(0).toUpperCase() || "P"}
    </span>
  );
}

function ActionButtons() {
  const disabledClasses =
    "rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-400 disabled:cursor-not-allowed disabled:opacity-60";
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled
        title="Disponível na próxima etapa"
        aria-label="Editar (disponível na próxima etapa)"
        className={disabledClasses}
      >
        Editar
      </button>
      <button
        type="button"
        disabled
        title="Disponível na próxima etapa"
        aria-label="Excluir (disponível na próxima etapa)"
        className={disabledClasses}
      >
        Excluir
      </button>
    </span>
  );
}

export function PlatformsList({ platforms }: { platforms: Platform[] }) {
  return (
    <div>
      {/* Tabela desktop */}
      <div className="hidden overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[880px] border-collapse text-left text-sm">
          <caption className="sr-only">
            Plataformas cadastradas no TremBoom
          </caption>
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <th scope="col" className="px-4 py-3 font-medium">
                Plataforma
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Slug
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Avaliação
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Destaque
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
            {platforms.map((platform) => (
              <tr
                key={platform.id}
                className="transition-colors hover:bg-zinc-50"
              >
                <td className="px-4 py-3">
                  <span className="flex items-center gap-3">
                    <PlatformLogo platform={platform} />
                    <span className="font-medium text-zinc-900">
                      {platform.name}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                  {platform.slug}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {formatRating(platform.rating)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge platform={platform} />
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {platform.is_featured === null ? "—" : platform.is_featured ? "Sim" : "Não"}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {platform.position ?? "—"}
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {formatDate(platform.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <ActionButtons />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <ul className="space-y-3 md:hidden">
        {platforms.map((platform) => (
          <li
            key={platform.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <PlatformLogo platform={platform} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-900">
                  {platform.name}
                </p>
                <p className="truncate font-mono text-xs text-zinc-500">
                  {platform.slug}
                </p>
              </div>
              <StatusBadge platform={platform} />
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div>
                <dt className="text-zinc-500">Avaliação</dt>
                <dd className="mt-0.5 font-medium text-zinc-800">
                  {formatRating(platform.rating)}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Destaque</dt>
                <dd className="mt-0.5 font-medium text-zinc-800">
                  {platform.is_featured === null
                    ? "—"
                    : platform.is_featured
                      ? "Sim"
                      : "Não"}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Posição</dt>
                <dd className="mt-0.5 font-medium text-zinc-800">
                  {platform.position ?? "—"}
                </dd>
              </div>
            </dl>
            <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="text-xs text-zinc-500">
                {formatDate(platform.created_at)}
              </span>
              <ActionButtons />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
