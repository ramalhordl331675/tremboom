"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { togglePartnerActiveAction } from "@/app/admin/partners/actions";

function ToggleButton({ isActive }: { isActive: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={isActive ? "Desativar parceiro" : "Ativar parceiro"}
      title={isActive ? "Desativar parceiro" : "Ativar parceiro"}
      className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "…" : isActive ? "Desativar" : "Ativar"}
    </button>
  );
}

export function TogglePartnerButton({
  id,
  name,
  isActive,
}: {
  id: string;
  name: string;
  isActive: boolean;
}) {
  const [state, formAction] = useActionState(
    togglePartnerActiveAction.bind(null, id, !isActive),
    { ok: false, message: "" }
  );

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <form
        action={formAction}
        onSubmit={(event) => {
          if (
            !window.confirm(
              `${isActive ? "Desativar" : "Ativar"} o parceiro "${name}"?`
            )
          ) {
            event.preventDefault();
          }
        }}
      >
        <ToggleButton isActive={isActive} />
      </form>
      {state.message && (
        <span role="alert" className="max-w-44 text-right text-xs text-red-600">
          {state.message}
        </span>
      )}
    </span>
  );
}
