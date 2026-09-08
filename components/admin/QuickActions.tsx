import Link from "next/link";
import {
  ContentIcon,
  MediaIcon,
  PlatformsIcon,
  SettingsIcon,
} from "@/components/admin/icons";

const ACTIONS = [
  {
    href: "/admin/platforms",
    label: "Adicionar plataforma",
    description: "Conectar uma nova origem de produtos",
    Icon: PlatformsIcon,
  },
  {
    href: "/admin/content",
    label: "Criar conteúdo",
    description: "Publicar um novo achadinho",
    Icon: ContentIcon,
  },
  {
    href: "/admin/media",
    label: "Gerenciar mídia",
    description: "Organizar imagens e arquivos",
    Icon: MediaIcon,
  },
  {
    href: "/admin/settings",
    label: "Configurações",
    description: "Ajustar o painel",
    Icon: SettingsIcon,
  },
];

export function QuickActions() {
  return (
    <section aria-label="Ações rápidas">
      <h2 className="text-base font-semibold">Ações rápidas</h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ACTIONS.map(({ href, label, description, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-700"
            >
              <Icon />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                {label}
              </span>
              <span className="block truncate text-xs text-zinc-500">
                {description}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
