import * as terms from "./layout-parser.terms.js";

const keywords = new Set([
  "WALL_THICKNESS", "SITE", "FACADE", "ROOF", "LIGHT", "AT", "POWER", "FLOOR",
  "ROOM", "BALCONY", "GARDEN", "GRID", "WALLS", "RAILS", "WINDOWS", "DOORS",
  "HEIGHT", "SURFACE", "STYLE", "MOUNT", "LAYOUT", "END",
]);

export function specializeKeyword(value, stack) {
  const keyword = value.toUpperCase();
  return keywords.has(keyword) && stack.canShift(terms[keyword]) ? terms[keyword] : -1;
}
