import { SERIES, SURFACES, APP_COLOR, GOOD, BAD } from "./tokens";

// Colour names the dashboard sections were written against, mapped onto the
// portal palette so every chart follows light/dark mode the same way.
export default function chartTheme(isDark) {
  const s = isDark ? SURFACES.dark : SURFACES.light;
  return {
    mainBg: "transparent",
    cardBg: s.paper,
    sidebarBg: s.raised,
    border: s.line,
    gridLine: s.line,
    gridBorder: s.paper,
    barTrack: s.line,
    textPrimary: s.ink,
    textHex: s.ink,
    textGray: s.muted,
    textSecondary: s.faint,
    accentBlue: SERIES[0],
    blue: SERIES[0],
    accentOrange: APP_COLOR.analytics,
    accentPurple: APP_COLOR.records,
    accentGreen: GOOD,
    accentRed: BAD,
    spGreen: GOOD,
    spRed: BAD,
    spNeutral: isDark ? "#33444C" : "#C9D3D6",
    stockGreen: GOOD,
    stockRed: BAD,
    stockDarkGreen: isDark ? "#1F5236" : "#2B6B45",
    stockDarkRed: isDark ? "#6E2B29" : "#8E3532",
    stockNeutral: isDark ? "#26363E" : "#E6ECEA",
    cluster0: s.faint,
    cluster1: SERIES[0],
    cluster2: BAD,
    colors: SERIES,
    ipColors: SERIES.slice(0, 6),
  };
}
