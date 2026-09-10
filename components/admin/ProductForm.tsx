"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createProductAction,
  updateProductAction,
  type ProductFormState,
} from "@/app/admin/products/actions";
import { SLUG_RE, isValidUrl, slugify } from "@/lib/platform-utils";
import type { Category } from "@/lib/supabase/categories";
import type { Platform } from "@/lib/supabase/platforms";
import type { ProductDetails } from "@/lib/supabase/products";

const INITIAL: ProductFormState = { ok: false, errors: {}, values: {} };

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
      {pending ? "Salvando…" : editing ? "Salvar alterações" : "Salvar produto"}
    </button>
  );
}

function strOrEmpty(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function ProductForm({
  categories,
  platforms,
  product,
  initialValues,
}: {
  categories: Category[];
  platforms: Pick<Platform, "id" | "name" | "slug">[];
  product?: ProductDetails;
  /** Pré-preenchimento seguro vindo da importação pelo link (opcional). */
  initialValues?: { affiliate_url?: string; platform_id?: string };
}) {
  const editing = Boolean(product);
  const action = editing
    ? updateProductAction.bind(null, product!.id)
    : createProductAction;
  const [state, formAction] = useActionState(action, INITIAL);
  const [name, setName] = useState(state.values.name ?? product?.name ?? "");
  const [slug, setSlug] = useState(state.values.slug ?? product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    state.values.image_url ?? product?.image_url ?? ""
  );
  const [imageBroken, setImageBroken] = useState(false);

  const effectiveSlug = !slugTouched && slug === "" ? slugify(name) : slug;
  const slugValid = effectiveSlug === "" || SLUG_RE.test(effectiveSlug);
  const imageValue = imageUrl.trim();
  const imagePreview = imageValue && isValidUrl(imageValue) && !imageBroken;

  if (categories.length === 0) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-amber-200 bg-amber-50 p-8 text-center shadow-sm"
      >
        <p className="text-sm font-medium text-amber-800">
          Crie uma categoria antes de cadastrar produtos.
        </p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-amber-700">
          Todo produto precisa pertencer a uma categoria ativa. O cadastro de
          categorias estará disponível em breve.
        </p>
      </div>
    );
  }

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
              aria-invalid={Boolean(state.errors.slug)}
              aria-describedby="slug-hint slug-error"
              className={`${inputClasses} ${withInvalid(Boolean(state.errors.slug))}`}
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
              rows={4}
              defaultValue={state.values.description ?? product?.description ?? ""}
              placeholder="Detalhes do produto para o visitante."
              className={`${inputClasses} resize-y`}
            />
            <FieldError id="description-error" message={state.errors.description} />
          </div>
        </div>
      </section>

      <section
        aria-label="Categoria e plataforma"
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h3 className="text-base font-semibold">Categoria e plataforma</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-zinc-700"
            >
              Categoria *
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              defaultValue={state.values.category_id ?? product?.category_id ?? ""}
              aria-invalid={Boolean(state.errors.category_id)}
              aria-describedby={state.errors.category_id ? "category-error" : undefined}
              className={`${inputClasses} ${withInvalid(Boolean(state.errors.category_id))}`}
            >
              <option value="">Selecione…</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <FieldError id="category-error" message={state.errors.category_id} />
          </div>

          <div>
            <label
              htmlFor="platform_id"
              className="block text-sm font-medium text-zinc-700"
            >
              Plataforma
            </label>
            <select
              id="platform_id"
              name="platform_id"
              defaultValue={
                state.values.platform_id ??
                product?.platform_id ??
                initialValues?.platform_id ??
                ""
              }
              className={inputClasses}
            >
              <option value="">Nenhuma plataforma</option>
              {platforms.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
            <FieldError id="platform-error" message={state.errors.platform_id} />
          </div>
        </div>
      </section>

      <section
        aria-label="Preços"
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h3 className="text-base font-semibold">Preços</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-zinc-700">
              Preço (R$) *
            </label>
            <input
              id="price"
              name="price"
              type="text"
              required
              inputMode="decimal"
              placeholder="Ex.: 19,90"
              defaultValue={state.values.price ?? strOrEmpty(product?.price)}
              aria-invalid={Boolean(state.errors.price)}
              aria-describedby={state.errors.price ? "price-error" : undefined}
              className={`${inputClasses} ${withInvalid(Boolean(state.errors.price))}`}
            />
            <FieldError id="price-error" message={state.errors.price} />
          </div>

          <div>
            <label
              htmlFor="old_price"
              className="block text-sm font-medium text-zinc-700"
            >
              Preço anterior (R$)
            </label>
            <input
              id="old_price"
              name="old_price"
              type="text"
              inputMode="decimal"
              placeholder="Ex.: 29,90"
              defaultValue={state.values.old_price ?? strOrEmpty(product?.old_price)}
              aria-invalid={Boolean(state.errors.old_price)}
              aria-describedby="old-price-hint old-price-error"
              className={`${inputClasses} ${withInvalid(Boolean(state.errors.old_price))}`}
            />
            <p id="old-price-hint" className="mt-1 text-xs text-zinc-500">
              Opcional. Usado para exibir o desconto.
            </p>
            <FieldError id="old-price-error" message={state.errors.old_price} />
          </div>
        </div>
      </section>

      <section
        aria-label="Mídia e link"
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h3 className="text-base font-semibold">Mídia e link</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              defaultValue={state.values.image_url ?? product?.image_url ?? ""}
              onChange={(event) => {
                setImageUrl(event.target.value);
                setImageBroken(false);
              }}
              aria-invalid={Boolean(state.errors.image_url)}
              aria-describedby={state.errors.image_url ? "image-error" : undefined}
              className={`${inputClasses} ${withInvalid(Boolean(state.errors.image_url))}`}
            />
            <FieldError id="image-error" message={state.errors.image_url} />
            {imagePreview ? (
              <span className="mt-2 flex items-center gap-3">
                <img
                  src={imageValue}
                  alt="Prévia da imagem"
                  onError={() => setImageBroken(true)}
                  className="h-12 w-12 rounded-md border border-zinc-200 bg-white object-cover"
                />
                <span className="text-xs text-zinc-500">Prévia da imagem</span>
              </span>
            ) : (
              imageValue && (
                <span className="mt-2 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-lg font-semibold text-zinc-300"
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
              required
              inputMode="url"
              placeholder="https://…"
              defaultValue={
                state.values.affiliate_url ??
                product?.affiliate_url ??
                initialValues?.affiliate_url ??
                ""
              }
              aria-invalid={Boolean(state.errors.affiliate_url)}
              aria-describedby="affiliate-hint affiliate-error"
              className={`${inputClasses} ${withInvalid(Boolean(state.errors.affiliate_url))}`}
            />
            <p id="affiliate-hint" className="mt-1 text-xs text-zinc-500">
              Link usado pelo TremBoom para direcionar o visitante.
            </p>
            <FieldError id="affiliate-error" message={state.errors.affiliate_url} />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="highlight_text"
              className="block text-sm font-medium text-zinc-700"
            >
              Texto de destaque
            </label>
            <input
              id="highlight_text"
              name="highlight_text"
              type="text"
              placeholder="Ex.: Oferta por tempo limitado"
              defaultValue={state.values.highlight_text ?? product?.highlight_text ?? ""}
              className={inputClasses}
            />
            <FieldError id="highlight-error" message={state.errors.highlight_text} />
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
              defaultValue={state.values.rating ?? strOrEmpty(product?.rating)}
              aria-invalid={Boolean(state.errors.rating)}
              aria-describedby={state.errors.rating ? "rating-error" : undefined}
              className={`${inputClasses} ${withInvalid(Boolean(state.errors.rating))}`}
            />
            <FieldError id="rating-error" message={state.errors.rating} />
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
                state.values.position ?? strOrEmpty(product?.position)
              }
              aria-invalid={Boolean(state.errors.position)}
              aria-describedby={state.errors.position ? "position-error" : undefined}
              className={`${inputClasses} ${withInvalid(Boolean(state.errors.position))}`}
            />
            <FieldError id="position-error" message={state.errors.position} />
          </div>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={product ? (product.is_featured ?? false) : false}
              className="h-5 w-5 accent-zinc-900"
            />
            Produto em destaque
          </label>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={product ? (product.is_active ?? true) : true}
              className="h-5 w-5 accent-zinc-900"
            />
            Produto ativo
          </label>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/admin/products"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Cancelar
        </Link>
        <SubmitButton editing={editing} />
      </div>
    </form>
  );
}
