import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { VisitTracker } from "@/components/analytics/VisitTracker";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-7PX77178W5";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TremBoom — Os melhores achadinhos, em um só lugar!",
  description:
    "Encontre achadinhos, ofertas, produtos em destaque e oportunidades selecionadas pelo TremBoom.",
  applicationName: "TremBoom",
  verification: {
    google: "h2e6CG0OUNbxRdMDd579ZJBWms0e72_3k8UxOeHJ2Ho",
  },
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
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <body className="flex min-h-full flex-col bg-[#FFF8F2] font-sans text-[#231610] antialiased">
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
