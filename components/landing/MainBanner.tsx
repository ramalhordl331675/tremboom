import Image from "next/image";

/**
 * Banner principal — faixa de largura total (ponta a ponta) exibida
 * no topo da Landing, acima do Hero/slides. A arte é exibida integral,
 * sem corte nem distorção (largura 100%, altura automática).
 */
export function MainBanner() {
  return (
    <section
      aria-label="Banner principal TremBoom"
      className="w-full min-w-0 bg-[#231610]"
    >
      <Image
        src="/tremboom-banner-principal.jpg"
        alt="Banner principal TremBoom — locomotiva com ofertas, frete grátis e cupons de desconto"
        width={1806}
        height={592}
        priority
        fetchPriority="high"
        sizes="100vw"
        className="h-auto w-full"
      />
    </section>
  );
}
