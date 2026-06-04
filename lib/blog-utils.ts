/**
 * Returns consistent Tailwind CSS classes for blog category badges
 */
export function getCategoryColor(category?: string) {
  const cat = category || "General";
  const colors: Record<string, string> = {
    "Brew Day": "bg-sky/10 text-sky-700 border-sky-200/50",
    "Tasting Notes": "bg-tan/20 text-forest border-tan/30",
    "Recipes": "bg-forest/5 text-forest border-forest/10",
    "Tips & Learning": "bg-amber-50 text-amber-700 border-amber-200/50",
    "General": "bg-tan/10 text-forest border-tan/30",
  };

  return colors[cat] || colors["General"];
}
