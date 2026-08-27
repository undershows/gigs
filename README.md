# Undershows — Site de Shows

[![Build and Deploy](https://github.com/undershows/gigs/actions/workflows/deploy.yml/badge.svg)](https://github.com/undershows/gigs/actions/workflows/deploy.yml)
[![Site](https://img.shields.io/website?url=https%3A%2F%2Fshows.undershows.com.br&label=shows.undershows.com.br)](https://shows.undershows.com.br)
[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Node](https://img.shields.io/badge/node-%E2%89%A522.12-339933?logo=node.js&logoColor=white)](https://nodejs.org)

Site estático com a agenda de shows da [Undershows](https://undershows.com.br), publicado em [shows.undershows.com.br](https://shows.undershows.com.br). É consumido pelo app Android da Undershows e também funciona como PWA (instalável pelo navegador).

## Como funciona

Não existe backend em produção. O conteúdo vem do Strapi **em build time**: o Astro busca os shows na API do CMS, gera todas as páginas como HTML estático e o resultado é publicado no GitHub Pages.

```
Strapi (cms.undershows.com.br)
        │  fetch no build
        ▼
Astro build ──► dist/ ──► GitHub Pages (branch gh-pages)
```

### Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Agenda de shows futuros, com filtro por estado e busca |
| `/cartaz/:id` | Página de compartilhamento de um show (OG tags p/ WhatsApp/Instagram) |
| `/artist/:slug` | Shows futuros de uma banda |
| `/calendar/:uf.ics` | Feed iCalendar (RFC 5545) com os shows futuros de um estado — assinável no Google Calendar, Apple Calendar, Outlook etc. |
| `/404` | Página não encontrada |

Todas geradas via `getStaticPaths()` no build — um show novo no Strapi só aparece no site após um rebuild.

### Calendário por estado

Na home, o botão "Adicionar ao Google Calendar" (e o link "copiar link do feed") aponta pro `.ics`
do estado selecionado (`/calendar/<UF>.ics`, ex. `/calendar/SP.ics`), gerado em `src/pages/calendar/[state].ics.ts`
com a lógica de montagem do feed em `src/lib/ics.ts`.

Como o site é 100% estático, o feed é regenerado a cada build — inclusive os disparados pelo Strapi
via `rebuild.yml` a cada mudança no cartaz. O link de assinatura nunca muda; só o conteúdo. A
velocidade com que cada app de calendário busca a atualização depende do intervalo de refresh dele
(o feed sinaliza `X-PUBLISHED-TTL`/`REFRESH-INTERVAL` de 6h, que o Google Calendar tende a ignorar
e o Apple Calendar/Outlook geralmente respeitam).

## Desenvolvimento

Requisitos: **Node 22.12+** e yarn.

```sh
yarn install
yarn dev        # dev server em localhost:4321
yarn build      # gera o site em ./dist/
yarn preview    # serve o build local
```

### Variáveis de ambiente

Copie `.env.example` para `.env`:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PUBLIC_STRAPI_URL` | URL da API do Strapi | `https://cms.undershows.com.br` |
| `PUBLIC_ASSETS_URL` | Base para URLs relativas de imagens | `https://media.undershows.com.br` |

## Deploy

Dois workflows no GitHub Actions, ambos buildam e publicam na branch `gh-pages`:

- **`deploy.yml`** — roda a cada push na `main`, diariamente às 03:05 UTC (cron) ou manualmente (`workflow_dispatch`).
- **`rebuild.yml`** — roda via `repository_dispatch` (evento `rebuild_site`), disparado pelo Strapi quando o conteúdo muda, ou manualmente.

## Segurança

- Links de ingresso vindos do CMS só são renderizados se forem `http(s)://` (bloqueia `javascript:` etc.).
- Todas as páginas têm Content-Security-Policy via meta tag; links externos usam `rel="noopener noreferrer"`.
- As actions do CI são pinadas por SHA de commit e o `GITHUB_TOKEN` tem permissão mínima (`contents: write`).
