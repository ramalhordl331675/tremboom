import Link from "next/link";
import { PartnerForm } from "@/components/admin/PartnerForm";

export default function AdminPartnerNewPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/partners"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          ← Voltar para parceiros
        </Link>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Novo parceiro
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Cadastre um novo parceiro para a vitrine da landing page.
        </p>
      </div>

      <PartnerForm />
    </div>
  );
}
