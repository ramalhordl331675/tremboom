export default function AdminPlatformsLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Carregando plataformas">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-md bg-zinc-200" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-zinc-200" />
        </div>
        <div className="h-11 w-44 animate-pulse rounded-md bg-zinc-200" />
      </div>
      <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-12 animate-pulse rounded-md bg-zinc-100"
          />
        ))}
      </div>
    </div>
  );
}
