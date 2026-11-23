import { alpha, darken, lighten } from "@mui/material/styles";

// Each top-level branch of the university gets its own hue; units further
// down use lighter (or, in dark mode, deeper) shades of the same hue, so you
// can tell at a glance which faculty or directorate a box belongs to.
const BRANCH_HUES = [
  "#0E9AA7", // teal
  "#4F6BED", // indigo
  "#E0557A", // rose
  "#E89A2C", // amber
  "#2FA36B", // green
  "#3BA7E0", // sky
  "#8B5CF6", // violet
  "#D2603A", // terracotta-orange
  "#7FA03A", // olive
];
export const ROOT_COLOR = "#475569";

export const KIND = {
  REKTORLUK: { label: "Rektörlük", icon: "account_balance" },
  GENEL_SEKRETERLIK: { label: "Genel sekreterlik", icon: "corporate_fare" },
  DAIRE: { label: "Daire başkanlığı", icon: "domain" },
  SUBE: { label: "Şube müdürlüğü", icon: "meeting_room" },
  FAKULTE: { label: "Fakülte", icon: "school" },
  BOLUM: { label: "Bölüm", icon: "menu_book" },
  ABD: { label: "Anabilim dalı", icon: "science" },
  ENSTITU: { label: "Enstitü", icon: "biotech" },
  YUKSEKOKUL: { label: "Yüksekokul", icon: "translate" },
  KOORDINATORLUK: { label: "Koordinatörlük", icon: "hub" },
};
export const kindOf = (n) => KIND[n.nodeType] || { label: "Birim", icon: "apartment" };

// id -> { node, parent, depth, branch }
export function indexTree(root) {
  const out = new Map();
  const walk = (node, parent, depth, branchColor) => {
    out.set(node.id, { node, parent, depth, color: branchColor });
    (node.children || []).forEach((c, i) =>
      walk(c, node.id, depth + 1, depth === 0 ? BRANCH_HUES[i % BRANCH_HUES.length] : branchColor)
    );
  };
  walk(root, null, 0, ROOT_COLOR);
  return out;
}

export function pathIds(index, id) {
  const ids = [];
  for (let cur = index.get(id); cur; cur = cur.parent ? index.get(cur.parent) : null)
    ids.unshift(cur.node.id);
  return ids;
}

// the colour a unit is drawn in: its branch hue, shaded by depth
export function unitColor(entry, dark) {
  if (!entry) return ROOT_COLOR;
  const steps = Math.max(0, entry.depth - 1);
  if (entry.depth === 0) return dark ? "#94A3B8" : ROOT_COLOR;
  return dark ? darken(entry.color, steps * 0.12) : lighten(entry.color, steps * 0.18);
}

export const tint = (c, a) => alpha(c, a);
