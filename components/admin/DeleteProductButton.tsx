"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteProductAction } from "@/app/admin/products/actions";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-red-300 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Excluindo…" : "Excluir"}
    </button>
  );
}

export function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [state, formAction] = useActionState(deleteProductAction.bind(null, id), {
    ok: false,
    message: "",
  });
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Excluir ${name}`}
        className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-red-300 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        Excluir
      </button>
    );
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <form
        action={formAction}
        onSubmit={(event) => {
          if (
            !window.confirm(
              `Excluir o produto "${name}"? Esta ação não pode ser desfeita.`
            )
          ) {
            event.preventDefault();
            setConfirming(false);
          }
        }}
        className="inline-flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-md px-2 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800"
        >
          Cancelar
        </button>
        <ConfirmButton />
      </form>
      {state.message && (
        <span role="alert" className="max-w-44 text-right text-xs text-red-600">
          {state.message}
        </span>
      )}
    </span>
  );
}
