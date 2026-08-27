// Geração de feeds iCalendar (.ics) por estado.
// Usado em src/pages/calendar/[state].ics.ts pra gerar, no build, um arquivo
// .ics estático por UF com os shows futuros daquele estado. Cada rebuild do
// site (disparado pelo Strapi a cada mudança de conteúdo — ver rebuild.yml)
// regenera esses arquivos, então o feed sempre reflete o cartaz atual.
// Assinantes (Google Calendar, Apple Calendar, etc.) puxam essa URL no
// intervalo deles — não temos como forçar um refresh imediato do lado deles.

import { getBands } from "./bands";

const PRODID = "-//Undershows//Agenda de Shows//PT-BR";

// Escapa texto pra uso em campos ICS (RFC 5545 §3.3.11).
function escapeText(str: string): string {
  return String(str ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

// Quebra linhas longas em 75 octetos com continuação (RFC 5545 §3.1).
function foldLine(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;

  const chunks: string[] = [];
  let rest = line;
  let first = true;

  while (rest.length > 0) {
    const limit = first ? 75 : 74; // linhas de continuação começam com 1 espaço
    let chunk = rest.slice(0, limit);
    // evita cortar no meio de um caractere multi-byte
    while (new TextEncoder().encode(chunk).length > limit && chunk.length > 0) {
      chunk = chunk.slice(0, -1);
    }
    chunks.push(chunk);
    rest = rest.slice(chunk.length);
    first = false;
  }

  return chunks.join("\r\n ");
}

// "2026-08-27" -> "20260827"
function toIcsDate(dateStr: string): string {
  return String(dateStr).replace(/-/g, "");
}

// Um dia depois de dateStr, no formato YYYYMMDD (DTEND é exclusivo p/ eventos de dia inteiro).
function nextDayIcsDate(dateStr: string): string {
  const [y, m, d] = String(dateStr).split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + 1);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

function nowStamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
}

type Show = {
  id: number | string;
  title?: string;
  date: string;
  city?: string;
  state?: string;
  bands?: string;
  ticket_link?: string;
};

function ticketLink(show: Show): string | null {
  const link = String(show.ticket_link || "").trim();
  return /^https?:\/\//i.test(link) ? link : null;
}

function buildEvent(show: Show, siteUrl: string): string {
  const dtstart = toIcsDate(show.date);
  const dtend = nextDayIcsDate(show.date);
  const bands = getBands(show);
  const showUrl = `${siteUrl}/cartaz/${show.id}`;

  const descriptionParts = [];
  if (bands.length > 0) descriptionParts.push(`Line-up: ${bands.join(" / ")}`);
  if (ticketLink(show)) descriptionParts.push(`Ingressos: ${ticketLink(show)}`);
  descriptionParts.push(showUrl);

  const lines = [
    "BEGIN:VEVENT",
    `UID:show-${show.id}@shows.undershows.com.br`,
    `DTSTAMP:${nowStamp()}`,
    `DTSTART;VALUE=DATE:${dtstart}`,
    `DTEND;VALUE=DATE:${dtend}`,
    `SUMMARY:${escapeText(show.title || "Show")}`,
    `LOCATION:${escapeText([show.city, show.state].filter(Boolean).join("/"))}`,
    `DESCRIPTION:${escapeText(descriptionParts.join("\n"))}`,
    `URL:${showUrl}`,
    "END:VEVENT",
  ];

  return lines.map(foldLine).join("\r\n");
}

// Monta o VCALENDAR completo pra um estado.
export function buildIcsCalendar(stateCode: string, shows: Show[], siteUrl: string): string {
  const header = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(`Undershows — ${stateCode}`)}`,
    "X-WR-TIMEZONE:America/Sao_Paulo",
    // Sinaliza p/ clientes que respeitam o hint (ex. Apple Calendar) que o
    // feed pode mudar com frequência. Google Calendar ignora e usa o
    // intervalo dele (normalmente algumas horas a 1 dia).
    "X-PUBLISHED-TTL:PT6H",
    "REFRESH-INTERVAL;VALUE=DURATION:PT6H",
  ].map(foldLine);

  const body = shows.map((show) => buildEvent(show, siteUrl));

  const footer = ["END:VCALENDAR"];

  return [...header, ...body, ...footer].join("\r\n") + "\r\n";
}
