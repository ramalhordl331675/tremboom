import Link from "next/link";
import { PlatformForm } from "@/components/admin/PlatformForm";

export default function AdminPlatformNewPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/platforms"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          ← Voltar para plataformas
        </Link>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Nova plataforma
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Cadastre uma nova origem de produtos do TremBoom.
        </p>
      </div>

      <PlatformForm />
    </div>
  );
}
