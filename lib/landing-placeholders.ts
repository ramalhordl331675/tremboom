/**
 * PLACEHOLDERS VISUAIS DA ETAPA G1.1 (sem Supabase).
 * Valores, descontos, avaliações e plataformas aqui são apenas ilustrativos
 * para compor o layout. Na etapa de dados reais, trocar por queries do
 * catálogo (platforms / categories / products) mantendo os tipos de exibição.
 */

export type LandingCategory = {
  slug: string;
  label: string;
  icon: string;
};

export type LandingProduct = {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  discountPct: number;
  rating: number;
  reviews: number;
  platform: string;
  badge?: string;
  hue: string;
};

export const NAV_LINKS = [
  "Categorias",
  "Início",
  "Achadinhos",
  "Eletrônicos",
  "Casa e Cozinha",
  "Beleza e Saúde",
  "Moda",
  "Esportes",
  "Brinquedos",
  "Automotivo",
  "Mais",
] as const;

export const LANDING_CATEGORIES: LandingCategory[] = [
  { slug: "achadinhos", label: "Achadinhos", icon: "sparkles" },
  { slug: "eletronicos", label: "Eletrônicos", icon: "chip" },
  { slug: "casa-cozinha", label: "Casa e Cozinha", icon: "home" },
  { slug: "beleza-saude", label: "Beleza e Saúde", icon: "heart" },
  { slug: "moda", label: "Moda", icon: "shirt" },
  { slug: "esportes", label: "Esportes", icon: "ball" },
  { slug: "brinquedos", label: "Brinquedos", icon: "blocks" },
  { slug: "automotivo", label: "Automotivo", icon: "wheel" },
  { slug: "mais", label: "Mais", icon: "grid" },
];

/** Cards apenas para demonstrar o layout (valores ilustrativos). Inicialmente o foco é Shopee. */
export const PLACEHOLDER_PRODUCTS: LandingProduct[] = [
  {
    id: "ph-01",
    name: "Fone Bluetooth dobrável com estojo de carga",
    price: 89.9,
    oldPrice: 149.9,
    discountPct: 40,
    rating: 4.8,
    reviews: 2314,
    platform: "Shopee",
    badge: "Destaque",
    hue: "from-orange-100 to-amber-100",
  },
  {
    id: "ph-02",
    name: "Air fryer compacta 4L com timer digital",
    price: 329.0,
    oldPrice: 499.0,
    discountPct: 34,
    rating: 4.9,
    reviews: 1876,
    platform: "Shopee",
    badge: "Destaque",
    hue: "from-rose-100 to-orange-100",
  },
  {
    id: "ph-03",
    name: "Kit skincare facial com 5 passos",
    price: 59.9,
    oldPrice: 119.9,
    discountPct: 50,
    rating: 4.7,
    reviews: 3421,
    platform: "Shopee",
    badge: "Destaque",
    hue: "from-pink-100 to-rose-100",
  },
  {
    id: "ph-04",
    name: "Tênis casual unissex amortecimento macio",
    price: 129.9,
    oldPrice: 219.9,
    discountPct: 41,
    rating: 4.6,
    reviews: 987,
    platform: "Shopee",
    badge: "Destaque",
    hue: "from-sky-100 to-cyan-100",
  },
  {
    id: "ph-05",
    name: "Luminária LED articulável para escritório",
    price: 74.9,
    oldPrice: 129.9,
    discountPct: 42,
    rating: 4.8,
    reviews: 654,
    platform: "Shopee",
    badge: "Destaque",
    hue: "from-yellow-100 to-amber-100",
  },
  {
    id: "ph-06",
    name: "Mochila impermeável 25L para notebook",
    price: 99.9,
    oldPrice: 179.9,
    discountPct: 44,
    rating: 4.7,
    reviews: 1123,
    platform: "Shopee",
    badge: "Destaque",
    hue: "from-emerald-100 to-teal-100",
  },
  {
    id: "ph-07",
    name: "Blocos de montar criativos 500 peças",
    price: 119.9,
    oldPrice: 199.9,
    discountPct: 40,
    rating: 4.9,
    reviews: 2109,
    platform: "Shopee",
    badge: "Destaque",
    hue: "from-violet-100 to-purple-100",
  },
  {
    id: "ph-08",
    name: "Aspirador de pó portátil para carro",
    price: 139.9,
    oldPrice: 229.9,
    discountPct: 39,
    rating: 4.5,
    reviews: 432,
    platform: "Shopee",
    badge: "Destaque",
    hue: "from-slate-200 to-slate-100",
  },
];

export function brl(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
