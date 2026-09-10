// COSTURA FUTURA — Open API oficial (NÃO IMPLEMENTADA NESTA ETAPA).
//
// A conta do TremBoom não possui acesso à Shopee Open API, e esta etapa
// PROÍBE scraping/crawler/automação. Por isso este arquivo contém SOMENTE
// tipos e a forma da futura integração — nenhuma chamada, nenhuma
// credencial, nenhuma variável de ambiente.
//
// Evolução planejada (quando houver API oficial autorizada):
//   1. implementar `OfficialProductProvider` com a API oficial;
//   2. em /admin/products/import, trocar o passo manual por:
//      link validado -> provider.fetchByUrl(url) -> revisão -> salvar;
//   3. o salvamento continua via createProductAction (inalterado).
//
// O que NÃO fazer aqui: fetch real, placeholders de chave/token,
// simulação de resposta da API.

/** Dados que uma API oficial poderia fornecer para revisão manual. */
export type OfficialProductData = {
  name?: string;
  price?: number;
  oldPrice?: number;
  imageUrl?: string;
  description?: string;
};

/** Contrato que um provedor oficial deverá implementar no futuro. */
export type OfficialProductProvider = {
  readonly platformSlug: string;
  fetchByUrl(url: string): Promise<OfficialProductData>;
};
