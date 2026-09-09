import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TremBoom — Os melhores achadinhos, em um só lugar!",
  description:
    "Encontre achadinhos, ofertas, produtos em destaque e oportunidades selecionadas pelo TremBoom.",
  applicationName: "TremBoom",
  openGraph: {
    title: "TremBoom — Os melhores achadinhos, em um só lugar!",
    description:
      "Encontre achadinhos, ofertas, produtos em destaque e oportunidades selecionadas pelo TremBoom.",
    type: "website",
    locale: "pt_BR",
    siteName: "TremBoom",
  },
  twitter: {
    card: "summary_large_image",
    title: "TremBoom — Os melhores achadinhos, em um só lugar!",
    description:
      "Encontre achadinhos, ofertas, produtos em destaque e oportunidades selecionadas pelo TremBoom.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col bg-[#FFF8F2] font-sans text-[#231610] antialiased">
        {children}
      </body>
    </html>
  );
}
