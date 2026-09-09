/** Transparência de afiliados — informação visível, sem esconder o modelo de negócio. */
export function AffiliateNotice() {
  return (
    <section aria-labelledby="transparencia-title" className="bg-[#FFF8F2]">
      <div className="mx-auto max-w-7xl px-4 pb-10 sm:pb-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-orange-100 bg-white p-5 text-center shadow-sm sm:p-6">
          <h2
            id="transparencia-title"
            className="text-sm font-black uppercase tracking-[0.2em] text-[#231610]"
          >
            Transparência
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">
            O TremBoom participa de programas de afiliados. Alguns links podem
            gerar uma comissão para o TremBoom quando uma compra é realizada
            através deles, sem custo adicional para você.
          </p>
        </div>
      </div>
    </section>
  );
}
