// lib/beerStyleTheme.ts

export function getBeerStyleGradient(style?: string) {
  if (!style) return "from-amber-200 to-amber-300";

  const s = style.toLowerCase();

  if (s.includes("stout") || s.includes("porter")) {
    return "from-stone-700 to-stone-800";
  }

  if (s.includes("ipa")) {
    return "from-orange-400 to-orange-500";
  }

  if (s.includes("lager")) {
    return "from-amber-400 to-amber-500";
  }

  return "from-amber-200 to-amber-300";
}