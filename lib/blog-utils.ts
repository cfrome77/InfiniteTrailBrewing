export function getCategoryColor(category?: string) {
  const colors: Record<string, string> = {
    "Brew Day": "bg-sky/20 text-sky border-sky/30",
    "Tasting Notes": "bg-amber-100 text-amber-900 border-amber-200",
    "Recipes": "bg-forest/10 text-forest border-forest/20",
    "Tips & Learning": "bg-emerald-100 text-emerald-900 border-emerald-200",
    "News": "bg-tan text-forest border-tan-dark/20",
  };

  return category ? (colors[category] || "bg-tan text-forest border-tan/50") : "bg-tan text-forest border-tan/50";
}

export function getTagColor(tag: string) {
  // Hash the tag name to get a consistent color if not specifically mapped
  const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "bg-blue-50 text-blue-700 border-blue-200",
    "bg-purple-50 text-purple-700 border-purple-200",
    "bg-pink-50 text-pink-700 border-pink-200",
    "bg-orange-50 text-orange-700 border-orange-200",
    "bg-teal-50 text-teal-700 border-teal-200",
  ];
  return colors[hash % colors.length];
}
