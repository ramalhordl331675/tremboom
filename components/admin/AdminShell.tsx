"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOutAction } from "@/app/admin/actions";
import {
  CategoriesIcon,
  CloseIcon,
  ContentIcon,
  DashboardIcon,
  LogoutIcon,
  MediaIcon,
  MenuIcon,
  PlatformsIcon,
  ProductsIcon,
  SettingsIcon,
} from "@/components/admin/icons";

export type AdminUser = {
  email: string;
  displayName: string;
  initial: string;
};

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", Icon: DashboardIcon },
  { href: "/admin/platforms", label: "Plataformas", Icon: PlatformsIcon },
  { href: "/admin/products", label: "Produtos", Icon: ProductsIcon },
  { href: "/admin/categories", label: "Categorias", Icon: CategoriesIcon },
  { href: "/admin/content", label: "Conteúdo", Icon: ContentIcon },
  { href: "/admin/media", label: "Mídia", Icon: MediaIcon },
  { href: "/admin/settings", label: "Configurações", Icon: SettingsIcon },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/platforms": "Plataformas",
  "/admin/products": "Produtos",
  "/admin/categories": "Categorias",
  "/admin/content": "Conteúdo",
  "/admin/media": "Mídia",
  "/admin/settings": "Configurações",
  "/admin/login": "Entrar",
};

function SidebarBody({
  user,
  pathname,
  onNavigate,
  onClose,
}: {
  user: AdminUser;
  pathname: string;
  onNavigate: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-zinc-900 text-zinc-100">
      <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-5">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-base font-bold text-zinc-900"
        >
          T
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-base font-semibold">TremBoom</span>
          <span className="block text-xs text-zinc-400">
            Painel administrativo
          </span>
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu do painel"
            className="flex h-11 w-11 items-center justify-center rounded-md text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      <nav aria-label="Navegação do painel" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={onNavigate}
                  className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    active
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <Icon />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-zinc-800 px-5 py-4">
        <p className="truncate text-sm font-medium text-zinc-100">
          {user.displayName}
        </p>
        <p className="truncate text-xs text-zinc-400">{user.email}</p>
        <form action={signOutAction} className="mt-3">
          <button
            type="submit"
            className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <LogoutIcon />
            Sair
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // O drawer fecha no clique em qualquer item (onNavigate) e com Escape abaixo.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  const title = PAGE_TITLES[pathname] ?? "TremBoom Admin";

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <SidebarBody user={user} pathname={pathname} onNavigate={() => {}} />
      </aside>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-zinc-950/50"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu do painel"
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw]"
          >
            <SidebarBody
              user={user}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
              onClose={() => setOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white">
          <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu do painel"
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-md text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 lg:hidden"
            >
              <MenuIcon />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold">{title}</h1>
            </div>
            <span
              aria-hidden="true"
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white sm:flex"
            >
              {user.initial}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
