"use client";

import Link from "next/link";
import { useState } from "react";
import { normalizeImportLink } from "@/lib/product-import/normalize";
import {
  identifyPlatformSlug,
  platformDisplayName,
} from "@/lib/product-import/platforms";
import { buildImportQuery } from "@/lib/product-import/prepare";

const inputClasses =
  "mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none";

type Phase =
  | { kind: "idle" }
  | { kind: "invalid"; message: string }
  | { kind: "unknown"; url: string }
  | { kind: "recognized"; platform: string; url: string }
  | { kind: "unregistered"; platform: string; url: string };

export function ImportLinkForm({
  shopeePlatformId,
}: {
  /** ID real da plataforma Shopee no banco, ou null se não cadastrada. */
  shopeePlatformId: string | null;
}) {
  const [link, setLink] = useState("");
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

  function handleContinue(event: React.FormEvent) {
    event.preventDefault();

    const normalized = normalizeImportLink(link);
    if (!normalized.ok) {
      setPhase({ kind: "invalid", message: normalized.error });
      return;
    }

    const hostname = new URL(normalized.url).hostname;
    const slug = identifyPlatformSlug(hostname);

    if (!slug) {
      setPhase({ kind: "unknown", url: normalized.url });
      return;
    }

    if (!shopeePlatformId) {
      setPhase({
        kind: "unregistered",
        platform: platformDisplayName(slug),
        url: normalized.url,
      });
      return;
    }

    setPhase({
      kind: "recognized",
      platform: platformDisplayName(slug),
      url: normalized.url,
    });
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleContinue}
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <label
          htmlFor="import-link"
          className="block text-sm font-medium text-zinc-700"
        >
          Link do produto
        </label>
        <input
          id="import-link"
          name="import-link"
          type="text"
          inputMode="url"
          autoComplete="off"
          placeholder="Cole aqui o link de afiliado"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          aria-invalid={phase.kind === "invalid"}
          aria-describedby={phase.kind === "invalid" ? "import-link-error" : undefined}
          className={inputClasses}
        />
        {phase.kind === "invalid" ? (
          <p role="alert" id="import-link-error" className="mt-1 text-xs text-red-600">
            {phase.message}
          </p>
        ) : null}
        <button
          type="submit"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Continuar
        </button>
      </form>

      {phase.kind === "unknown" ? (
        <div
          role="status"
          className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6"
        >
          <p className="text-sm font-medium text-amber-800">
            Plataforma não reconhecida. Você pode continuar pelo cadastro
            manual.
          </p>
          <Link
            href="/admin/products/new"
            className="mt-3 inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            Ir para o cadastro manual
          </Link>
        </div>
      ) : null}

      {phase.kind === "unregistered" ? (
        <div
          role="status"
          className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6"
        >
          <p className="text-sm font-medium text-amber-800">
            Link reconhecido — plataforma {phase.platform} ✓
          </p>
          <p className="mt-1 max-w-xl break-all text-xs text-amber-700">
            {phase.url}
          </p>
          <p className="mt-2 text-sm text-amber-800">
            Ainda não há uma plataforma {phase.platform} cadastrada no
            TremBoom. Cadastre-a em{" "}
            <Link href="/admin/platforms" className="font-semibold underline">
              Plataformas
            </Link>{" "}
            ou continue pelo cadastro manual.
          </p>
          <Link
            href="/admin/products/new"
            className="mt-3 inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            Ir para o cadastro manual
          </Link>
        </div>
      ) : null}

      {phase.kind === "recognized" && shopeePlatformId ? (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-5 shadow-sm sm:p-6"
        >
          <p className="text-sm font-medium text-green-800">Link reconhecido</p>
          <dl className="mt-2 space-y-1 text-sm text-green-900">
            <div className="flex gap-2">
              <dt className="font-medium">Plataforma:</dt>
              <dd>{phase.platform} ✓</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium">Link:</dt>
              <dd className="break-all">{phase.url}</dd>
            </div>
          </dl>
          <p className="mt-2 text-sm text-green-800">
            Sem acesso à API da plataforma, os dados do produto precisam ser
            preenchidos ou revisados manualmente.
          </p>
          <Link
            href={buildImportQuery({
              affiliate_url: phase.url,
              platform_id: shopeePlatformId,
            })}
            className="mt-3 inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            Continuar para cadastro
          </Link>
        </div>
      ) : null}
    </div>
  );
}
