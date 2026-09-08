"use client";

export default function AdminPlatformsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Plataformas</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Gerencie as origens de produtos do TremBoom, como Shopee e outras
          plataformas.
        </p>
      </div>
      <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 p-8 text-center shadow-sm"
      >
        <p className="text-sm font-medium text-red-800">
          Não foi possível carregar as plataformas.
        </p>
        <p className="mt-1 text-xs text-red-600">
          Verifique sua conexão e tente novamente.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
