const STATS = [
  {
    label: "Plataformas",
    hint: "Em breve",
  },
  {
    label: "Conteúdos",
    hint: "Em breve",
  },
  {
    label: "Usuários",
    hint: "Em breve",
  },
  {
    label: "Cliques",
    hint: "Em breve",
  },
];

export function DashboardStats() {
  return (
    <section aria-label="Resumo">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <article
            key={stat.label}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow"
          >
            <h3 className="text-sm font-medium text-zinc-500">{stat.label}</h3>
            <p className="mt-2 text-3xl font-bold text-zinc-300" aria-hidden="true">
              —
            </p>
            <p className="mt-1 text-xs text-zinc-400">{stat.hint}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
