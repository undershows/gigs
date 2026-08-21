// Lógica central de nomes de banda: slug da URL, canonicalização e parsing.
// Usado no build (getStaticPaths) e nos templates (index + artist).

// Bandas com grafia ambígua: cada variante normalizada aponta pro nome canônico.
// A chave é o nome SEM espaço/pontuação, minúsculo (ver normalizeKey). O valor é
// como a banda deve aparecer — e é ele que gera o slug.
//
// Ex.: NW77 / NW 77 / N.W77 / N W 77 / "N.W. 77"  ->  "N W 77"  ->  /artist/n-w-77
//
// Pra adicionar uma banda nova, é só uma linha aqui.
const BAND_ALIASES: Record<string, string> = {
  nw77: "N W 77",
};

// Remove acentos (diacríticos combinantes U+0300–U+036F).
function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Normaliza pra chave de lookup: sem acento, sem espaço/pontuação, minúsculo.
function normalizeKey(name: string): string {
  return stripAccents(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

// Resolve o nome canônico de uma banda (aplica alias; senão só dá trim).
export function canonicalBand(name: string): string {
  return BAND_ALIASES[normalizeKey(name)] || name.trim();
}

// Gera o slug da URL (/artist/<slug>). Canonicaliza antes, então todas as
// grafias de uma banda com alias caem no mesmo slug.
export function slugify(name: string): string {
  return stripAccents(canonicalBand(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Extrai as bandas de um show (campo `bands`, separado por vírgula), já canônicas.
export function getBands(show: { bands?: string }): string[] {
  const raw = show?.bands || "";
  return raw
    .split(",")
    .map((b) => canonicalBand(b))
    .filter(Boolean);
}
