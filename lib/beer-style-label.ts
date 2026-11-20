import { beerStyles } from "@/sanity/constants/beerStyles";
import type { Beer } from "@/types";

/**
 * The label a visitor should see for a beer's style.
 *
 * `Beer.style` is either a resolved reference (an object with a `title`) or a
 * plain enum value from `beerStyles` (`"dry_cider"`). Only the reference case
 * is presentable, so the enum has to be translated. Three places render this
 * label — the page body, the page metadata and the social card — and one had
 * already drifted, printing `dry_cider` onto the card while the page said
 * "Dry Cider". Keeping the rule here stops the next caller repeating it.
 */
export function beerStyleLabel(style: Beer["style"] | undefined | null): string {
  if (!style) return "";

  if (typeof style === "object") return style.title ?? "";

  return beerStyles.find((s) => s.value === style)?.title || style;
}
