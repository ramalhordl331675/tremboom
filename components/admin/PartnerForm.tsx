"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createPartnerAction,
  updatePartnerAction,
  type PartnerFormState,
} from "@/app/admin/partners/actions";
import { SLUG_RE, isValidUrl, slugify } from "@/lib/platform-utils";
import type { PartnerDetails } from "@/lib/supabase/partners";

const INITIAL: PartnerFormState = { ok: false, errors: {}, values: {} };

function FieldError({ message, id }: { message?: string; id: string }) {
  if (!message) return null;
  return (
    <p role="alert" id={id} className="mt-1 text-xs text-red-600">
      {message}
    </p>
  );
}

const inputClasses =
  "mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none";

function withInvalid(hasError: boolean) {
  return hasError ? "border-red-400" : "";
}

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Salvando…" : editing ? "Salvar alterações" : "Salvar parceiro"}
    </button>
  );
}

function strOrEmpty(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function PartnerForm({ partner }: { partner?: PartnerDetails }) {
  const editing = Boolean(partner);
  const action = editing
    ? updatePartnerAction.bind(null, partner!.id)
    : createPartnerAction;
  const [state, formAction] = useActionState(action, INITIAL);
  const [name, setName] = useState(state.values.name ?? partner?.name ?? "");
  const [slug, setSlug] = useState(state.values.slug ?? partner?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    state.values.image_url ?? partner?.image_url ?? ""
  );
  const [imageBroken, setImageBroken] = useState(false);

  const effectiveSlug = !slugTouched && slug === "" ? slugify(name) : slug;
  const slugValid = effectiveSlug === "" || SLUG_RE.test(effectiveSlug);
  const imageValue = imageUrl.trim();
  const imagePreview = imageValue && isValidUrl(imageValue) && !imageBroken;

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
              aria-invalid={Boolean(state.errors.name)}
              aria-describedby={state.errors.name ? "name-error" : undefined}
              className={`${inputClasses} ${withInvalid(Boolean(state.errors.name))}`}
            />
            <FieldError id="name-error" message={state.errors.name} />
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
              aria-invalid={Boolean(state.errors.slug)}
              className={`${inputClasses} ${withInvalid(Boolean(state.errors.slug))}`}
            />
            <p id="slug-hint" className="mt-1 text-xs text-zinc-500">
              Gerado do nome; minúsculas, números e hífens.
              {!slugValid && (
                <span className="text-red-600">
                  {" "}Formato atual inválido.
                </span>
              )}
            </p>
            <FieldError id="slug-error" message={state.errors.slug} />
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
              rows={3}
              defaultValue={state.values.description ?? partner?.description ?? ""}
              placeholder="Texto curto exibido junto ao parceiro na landing."
              className={`${inputClasses} resize-y`}
            />
            <FieldError id="description-error" message={state.errors.description} />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-zinc-700"
            >
              Categoria
            </label>
            <input
              id="category"
              name="category"
              type="text"
              maxLength={60}
              autoComplete="off"
              placeholder="Ex.: moda, tecnologia"
              defaultValue={state.values.category ?? partner?.category ?? ""}
              className={inputClasses}
            />
            <FieldError id="category-error" message={state.errors.category} />
          </div>

          <div>
            <label
              htmlFor="button_text"
              className="block text-sm font-medium text-zinc-700"
            >
              Texto do botão
            </label>
            <input
              id="button_text"
              name="button_text"
              type="text"
              maxLength={60}
              autoComplete="off"
              placeholder="Ex.: Ver ofertas (padrão)"
              defaultValue={state.values.button_text ?? partner?.button_text ?? ""}
              className={inputClasses}
            />
            <FieldError id="button_text-error" message={state.errors.button_text} />
          </div>
        </div>
      </section>

      <section
        aria-label="Imagem e link"
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h3 className="text-base font-semibold">Imagem e link</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="image_url"
              className="block text-sm font-medium text-zinc-700"
            >
              Imagem do parceiro *
            </label>
            <input
              id="image_url"
              name="image_url"
              type="url"
              inputMode="url"
              required
              placeholder="https://…"
              value={imageUrl}
              onChange={(event) => {
                setImageUrl(event.target.value);
                setImageBroken(false);
              }}
              aria-invalid={Boolean(state.errors.image_url)}
              className={`${inputClasses} ${withInvalid(Boolean(state.errors.image_url))}`}
            />
            <FieldError id="image_url-error" message={state.errors.image_url} />
            {imagePreview ? (
              <span className="mt-2 flex items-center gap-3">
                <img
                  src={imageValue}
                  alt="Prévia da imagem do parceiro"
                  loading="lazy"
                  onError={() => setImageBroken(true)}
                  className="h-12 w-20 rounded-md border border-zinc-200 bg-white object-cover"
                />
                <span className="text-xs text-zinc-500">Prévia da imagem</span>
              </span>
            ) : (
              imageValue && (
                <span className="mt-2 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-20 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-lg font-semibold text-zinc-300"
                  >
                    ?
                  </span>
                  <span className="text-xs text-zinc-500">
                    {isValidUrl(imageValue)
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
              Link de afiliado *
            </label>
            <input
              id="affiliate_url"
              name="affiliate_url"
              type="url"
              inputMode="url"
              required
              placeholder="https://…"
              defaultValue={state.values.affiliate_url ?? partner?.affiliate_url ?? ""}
              aria-describedby="affiliate-hint"
              aria-invalid={Boolean(state.errors.affiliate_url)}
              className={`${inputClasses} ${withInvalid(Boolean(state.errors.affiliate_url))}`}
            />
            <p id="affiliate-hint" className="mt-1 text-xs text-zinc-500">
              Usado como está na landing, sem alteração.
            </p>
            <FieldError id="affiliate_url-error" message={state.errors.affiliate_url} />
          </div>
        </div>
      </section>

      <section
        aria-label="Exibição"
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h3 className="text-base font-semibold">Exibição</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="display_order"
              className="block text-sm font-medium text-zinc-700"
            >
              Ordem de exibição
            </label>
            <input
              id="display_order"
              name="display_order"
              type="number"
              step={1}
              placeholder="0"
              defaultValue={
                state.values.display_order ?? strOrEmpty(partner?.display_order)
              }
              className={inputClasses}
            />
            <FieldError
              id="display_order-error"
              message={state.errors.display_order}
            />
          </div>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 sm:self-end">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={partner ? (partner.is_active ?? true) : true}
              className="h-5 w-5 accent-zinc-900"
            />
            Parceiro ativo (visível na landing)
          </label>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/admin/partners"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Cancelar
        </Link>
        <SubmitButton editing={editing} />
      </div>
    </form>
  );
}
