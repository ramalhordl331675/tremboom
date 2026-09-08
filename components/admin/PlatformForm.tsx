"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createPlatformAction,
  type PlatformFormState,
} from "@/app/admin/platforms/actions";
import { SLUG_RE, isValidUrl, slugify } from "@/lib/platform-utils";

const INITIAL: PlatformFormState = { ok: false, errors: {}, values: {} };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-xs text-red-600">
      {message}
    </p>
  );
}

const inputClasses =
  "mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Salvando…" : "Salvar plataforma"}
    </button>
  );
}

export function PlatformForm() {
  const [state, formAction] = useActionState(createPlatformAction, INITIAL);
  const [name, setName] = useState(state.values.name ?? "");
  const [slug, setSlug] = useState(state.values.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [logoUrl, setLogoUrl] = useState(state.values.logo_url ?? "");
  const [logoBroken, setLogoBroken] = useState(false);

  const effectiveSlug = !slugTouched && slug === "" ? slugify(name) : slug;
  const slugValid = effectiveSlug === "" || SLUG_RE.test(effectiveSlug);
  const logoValue = logoUrl.trim();
  const logoPreview = logoValue && isValidUrl(logoValue) && !logoBroken;

  return (
    <form action={formAction} className="space-y-6">
      {state.errors.form && (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.errors.form}
        </p>
      )}

      <section
        aria-label="Informações principais"
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h3 className="text-base font-semibold">Informações principais</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
              Nome *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="off"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClasses}
            />
            <FieldError message={state.errors.name} />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-zinc-700">
              Slug *
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              autoComplete="off"
              value={effectiveSlug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value.toLowerCase());
              }}
              aria-describedby="slug-hint"
              className={inputClasses}
            />
            <p id="slug-hint" className="mt-1 text-xs text-zinc-500">
              Gerado do nome; minúsculas, números e hífens.
              {!slugValid && (
                <span className="text-red-600">
                  {" "}Formato atual inválido.
                </span>
              )}
            </p>
            <FieldError message={state.errors.slug} />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-700"
            >
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={state.values.description ?? ""}
              placeholder="Descreva a plataforma e seus diferenciais."
              className={`${inputClasses} resize-y`}
            />
            <FieldError message={state.errors.description} />
          </div>
        </div>
      </section>

      <section
        aria-label="Link e benefícios"
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h3 className="text-base font-semibold">Link e benefícios</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="logo_url"
              className="block text-sm font-medium text-zinc-700"
            >
              Logo URL
            </label>
            <input
              id="logo_url"
              name="logo_url"
              type="url"
              inputMode="url"
              placeholder="https://…"
              defaultValue={state.values.logo_url ?? ""}
              onChange={(event) => {
                setLogoUrl(event.target.value);
                setLogoBroken(false);
              }}
              className={inputClasses}
            />
            <FieldError message={state.errors.logo_url} />
            {logoPreview ? (
              <span className="mt-2 flex items-center gap-3">
                <img
                  src={logoValue}
                  alt="Prévia da logo"
                  onError={() => setLogoBroken(true)}
                  className="h-12 w-12 rounded-md border border-zinc-200 bg-white object-contain"
                />
                <span className="text-xs text-zinc-500">Prévia da logo</span>
              </span>
            ) : (
              logoValue && (
                <span className="mt-2 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-lg font-semibold text-zinc-300"
                  >
                    ?
                  </span>
                  <span className="text-xs text-zinc-500">
                    {isValidUrl(logoValue)
                      ? "Não foi possível carregar a imagem."
                      : "Digite uma URL válida para ver a prévia."}
                  </span>
                </span>
              )
            )}
          </div>

          <div>
            <label
              htmlFor="affiliate_url"
              className="block text-sm font-medium text-zinc-700"
            >
              Link da plataforma
            </label>
            <input
              id="affiliate_url"
              name="affiliate_url"
              type="url"
              inputMode="url"
              placeholder="https://…"
              defaultValue={state.values.affiliate_url ?? ""}
              aria-describedby="affiliate-hint"
              className={inputClasses}
            />
            <p id="affiliate-hint" className="mt-1 text-xs text-zinc-500">
              Link usado pelo TremBoom para direcionar o visitante.
            </p>
            <FieldError message={state.errors.affiliate_url} />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="bonus_text"
              className="block text-sm font-medium text-zinc-700"
            >
              Texto de bônus
            </label>
            <input
              id="bonus_text"
              name="bonus_text"
              type="text"
              maxLength={120}
              placeholder="Ex.: bônus de boas-vindas"
              defaultValue={state.values.bonus_text ?? ""}
              className={inputClasses}
            />
            <FieldError message={state.errors.bonus_text} />
          </div>
        </div>
      </section>

      <section
        aria-label="Configuração"
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h3 className="text-base font-semibold">Configuração</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-zinc-700"
            >
              Avaliação (0 a 5)
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              min={0}
              max={5}
              step={0.1}
              inputMode="decimal"
              placeholder="Ex.: 4.5"
              defaultValue={state.values.rating ?? ""}
              className={inputClasses}
            />
            <FieldError message={state.errors.rating} />
          </div>

          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-zinc-700"
            >
              Posição
            </label>
            <input
              id="position"
              name="position"
              type="number"
              step={1}
              placeholder="0"
              defaultValue={state.values.position ?? ""}
              className={inputClasses}
            />
            <FieldError message={state.errors.position} />
          </div>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={false}
              className="h-5 w-5 accent-zinc-900"
            />
            Destaque na vitrine
          </label>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked
              className="h-5 w-5 accent-zinc-900"
            />
            Plataforma ativa
          </label>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/admin/platforms"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Cancelar
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
