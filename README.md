# Undershows — Site de Shows

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
| `/404` | Página não encontrada |

Todas geradas via `getStaticPaths()` no build — um show novo no Strapi só aparece no site após um rebuild.

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
