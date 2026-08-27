// Gera /calendar/<UF>.ics — um feed iCalendar estático por estado, com os
// shows futuros daquele estado. Regenerado a cada build (ver rebuild.yml,
// disparado pelo Strapi quando o conteúdo muda), então o link do feed é
// sempre o mesmo mas o conteúdo reflete o cartaz atual. Quem assina esse
// link (Google Calendar, Apple Calendar, Outlook...) recebe as atualizações
// no intervalo de refresh do próprio app — não é instantâneo.
import type { APIRoute } from "astro";
import { buildIcsCalendar } from "../../lib/ics";

const SITE_URL = "https://shows.undershows.com.br";

const STATES = [
  "SP", "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES",
  "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI",
  "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "TO",
];

async function fetchUpcomingShows({ pageSize = 100 } = {}) {
  const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL ?? "https://cms.undershows.com.br";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, "0")}-` +
    `${String(today.getDate()).padStart(2, "0")}`;

  const all = [];
  let page = 1;

  while (true) {
    const url =
      `${STRAPI_URL}/api/shows` +
      `?sort[0]=date:asc&sort[1]=id:asc` +
      `&filters[date][$gte]=${encodeURIComponent(minDate)}` +
      `&pagination[page]=${page}` +
      `&pagination[pageSize]=${pageSize}`;

    const res = await fetch(url);
    if (!res.ok) {
      console.error("[calendar] Erro ao buscar shows no Strapi:", res.status, await res.text());
      break;
    }

    const json = await res.json();
    const data = json?.data ?? [];
    all.push(...data);

    if (data.length < pageSize) break;
    page++;
  }

  return all;
}

// 🔁 gera /calendar/<UF>.ics pra cada estado, em build time
export async function getStaticPaths() {
  const allShows = await fetchUpcomingShows();

  const byState = new Map<string, any[]>();
  for (const uf of STATES) byState.set(uf, []);

  for (const show of allShows) {
    const uf = show.state;
    if (byState.has(uf)) byState.get(uf)!.push(show);
  }

  return STATES.map((uf) => ({
    params: { state: uf },
    props: { shows: byState.get(uf) ?? [] },
  }));
}

export const GET: APIRoute = ({ params, props }) => {
  const stateCode = String(params.state);
  const body = buildIcsCalendar(stateCode, props.shows, SITE_URL);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="undershows-${stateCode}.ics"`,
    },
  });
};
