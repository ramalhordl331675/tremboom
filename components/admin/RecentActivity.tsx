import { ClockIcon } from "@/components/admin/icons";

export function RecentActivity() {
  return (
    <section aria-label="Atividade recente">
      <h2 className="text-base font-semibold">Atividade recente</h2>
      <div className="mt-3 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
        <span
          aria-hidden="true"
          className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-400"
        >
          <ClockIcon />
        </span>
        <p className="mt-3 text-sm font-medium text-zinc-700">
          Não há atividades recentes.
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          As movimentações do painel aparecerão aqui.
        </p>
      </div>
    </section>
  );
}
