import { createTheme } from "@mui/material/styles";
import { APP_COLOR, SURFACES, GOOD, BAD } from "./tokens";

export default function makeTheme(darkMode, appKey = "host") {
  const s = darkMode ? SURFACES.dark : SURFACES.light;
  return createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: APP_COLOR[appKey] || APP_COLOR.host },
      secondary: { main: s.muted },
      info: { main: APP_COLOR.host },
      success: { main: GOOD },
      warning: { main: APP_COLOR.analytics },
      error: { main: BAD },
      background: { default: s.bg, paper: s.paper },
      text: { primary: s.ink, secondary: s.muted, disabled: s.faint },
      divider: s.line,
      surface: s,
    },
    shape: { borderRadius: 6 },
    typography: {
      fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
      h1: { fontWeight: 600, fontSize: "2.6rem", lineHeight: 1.1, letterSpacing: "-0.02em" },
      h2: { fontWeight: 600, fontSize: "2rem", lineHeight: 1.15, letterSpacing: "-0.015em" },
      h3: { fontWeight: 600, fontSize: "1.6rem", lineHeight: 1.2 },
      h4: {
        fontFamily: '"IBM Plex Sans Condensed", "IBM Plex Sans", sans-serif',
        fontWeight: 600,
        fontSize: "1.9rem",
        fontVariantNumeric: "tabular-nums",
      },
      h5: { fontWeight: 600, fontSize: "1.15rem" },
      h6: { fontWeight: 600, fontSize: "1rem" },
      button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
      caption: { color: s.muted },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { fontFeatureSettings: '"tnum" 1' },
          "*:focus-visible": { outline: `2px solid ${APP_COLOR.host}`, outlineOffset: 2 },
          "@media (prefers-reduced-motion: reduce)": {
            "*": {
              animationDuration: "0.01ms !important",
              transitionDuration: "0.01ms !important",
            },
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { border: `1px solid ${s.line}`, backgroundImage: "none", borderRadius: 8 },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: s.line },
          head: { color: s.muted, fontWeight: 600, fontSize: "0.8rem" },
        },
      },
    },
  });
}
