# TremBoom — Portal de achadinhos e ofertas

O TremBoom é um portal de curadoria e divulgação de achadinhos e ofertas.
O usuário descobre os produtos no TremBoom e conclui a compra diretamente
na loja parceira (inicialmente Shopee).

Este projeto integra em uma única base:

* Landing pública `/` (`app/page.tsx`, `components/landing/*`)
* Admin em `/admin` (`app/admin/**`, `components/admin/*`)
* Supabase (auth, clientes SSR/browser, RLS e migrations em `supabase/migrations`)
* Middleware de sessão (`middleware.ts`)

## Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) para ver a landing page.

O admin continua disponível em [http://localhost:3000/admin](http://localhost:3000/admin).

## Validação

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Notas

Base Next.js (App Router) + Tailwind CSS v4 + TypeScript.
Projeto gerado a partir de `create-next-app` e evoluído com Admin + Landing.
