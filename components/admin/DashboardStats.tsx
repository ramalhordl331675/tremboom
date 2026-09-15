import { getVisitStats } from "@/lib/supabase/visits";

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

export async function DashboardStats() {
  const visits = await getVisitStats();

  return (
    <section aria-label="Resumo">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow">
          <h3 className="text-sm font-medium text-zinc-500">Visitas</h3>
          <p className="mt-2 text-3xl font-bold">
            {new Intl.NumberFormat("pt-BR").format(visits.total)}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            {new Intl.NumberFormat("pt-BR").format(visits.today)} hoje
            {" · "}
            {new Intl.NumberFormat("pt-BR").format(visits.last_7_days)} nos
            últimos 7 dias
          </p>
        </article>
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
