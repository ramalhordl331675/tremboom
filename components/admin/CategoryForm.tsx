"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createCategoryAction,
  updateCategoryAction,
  type CategoryFormState,
} from "@/app/admin/categories/actions";
import { SLUG_RE, slugify } from "@/lib/platform-utils";
import type { CategoryDetails } from "@/lib/supabase/categories";

const INITIAL: CategoryFormState = { ok: false, errors: {}, values: {} };

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

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Salvando…" : editing ? "Salvar alterações" : "Salvar categoria"}
    </button>
  );
}

export function CategoryForm({ category }: { category?: CategoryDetails }) {
  const editing = Boolean(category);
  const action = editing
    ? updateCategoryAction.bind(null, category!.id)
    : createCategoryAction;
  const [state, formAction] = useActionState(action, INITIAL);

  const initialName = state.values.name ?? category?.name ?? "";
  const initialSlug = state.values.slug ?? category?.slug ?? "";
  const [name, setName] = useState(initialName);
  const [slug, setSlug] = useState(initialSlug);
  const [slugTouched, setSlugTouched] = useState(false);

  const effectiveSlug = !slugTouched && slug === "" ? slugify(name) : slug;
  const slugValid = effectiveSlug === "" || SLUG_RE.test(effectiveSlug);

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
        aria-label="Dados da categoria"
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              className={inputClasses}
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
              aria-invalid={Boolean(state.errors.slug)}
              aria-describedby="slug-hint slug-error"
              className={inputClasses}
            />
            <p id="slug-hint" className="mt-1 text-xs text-zinc-500">
              Gerado do nome; minúsculas, números e hífens.
              {!slugValid && (
                <span className="text-red-600"> Formato atual inválido.</span>
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
              defaultValue={state.values.description ?? category?.description ?? ""}
              placeholder="Descrição exibida na página da categoria."
              className={`${inputClasses} resize-y`}
            />
            <FieldError id="description-error" message={state.errors.description} />
          </div>

          <div>
            <label
              htmlFor="image_url"
              className="block text-sm font-medium text-zinc-700"
            >
              Imagem URL
            </label>
            <input
              id="image_url"
              name="image_url"
              type="url"
              inputMode="url"
              placeholder="https://…"
              defaultValue={state.values.image_url ?? category?.image_url ?? ""}
              aria-invalid={Boolean(state.errors.image_url)}
              aria-describedby={state.errors.image_url ? "image-error" : undefined}
              className={inputClasses}
            />
            <FieldError id="image-error" message={state.errors.image_url} />
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
              defaultValue={
                state.values.position ?? category?.position?.toString() ?? ""
              }
              aria-invalid={Boolean(state.errors.position)}
              aria-describedby={state.errors.position ? "position-error" : undefined}
              className={inputClasses}
            />
            <FieldError id="position-error" message={state.errors.position} />
          </div>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 sm:col-span-2">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={category ? category.is_active !== false : true}
              className="h-5 w-5 accent-zinc-900"
            />
            Categoria ativa
          </label>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/admin/categories"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Cancelar
        </Link>
        <SubmitButton editing={editing} />
      </div>
    </form>
  );
}
