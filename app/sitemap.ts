import type { MetadataRoute } from "next";
import { getActiveCategories } from "@/lib/supabase/categories";

const SITE_URL = "https://tremboom.com";

/**
 * Sitemap público — rota "/sitemap.xml" gerada pelo Next.js (App Router).
 * Contém somente páginas públicas indexáveis: a landing "/" e as
 * páginas de categoria ("/categoria/[slug]") ativas no Supabase.
 * Rotas /admin, /api e login nunca entram aqui.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  try {
    const categories = await getActiveCategories();
    return [
      ...home,
      ...categories.map((c) => ({
        url: `${SITE_URL}/categoria/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    // Supabase indisponível: responde ao menos com a home (XML válido,
    // nunca 404/500) para o Search Console conseguir buscar o sitemap.
    return home;
  }
}
