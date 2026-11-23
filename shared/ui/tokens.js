// One source for colours so the shell, both remotes and the charts agree.
// Each app has its own identity colour; the shell uses it to mark which
// remote a piece of the page came from.
export const APP_COLOR = {
  host: "#0E7C86",
  analytics: "#D9932E",
  records: "#6B4E9B",
};

export const SURFACES = {
  light: {
    bg: "#F4F6F5",
    paper: "#FFFFFF",
    raised: "#FAFBFB",
    line: "#DDE3E1",
    ink: "#1B2A33",
    muted: "#5C6B73",
    faint: "#8A979D",
  },
  dark: {
    bg: "#0F171B",
    paper: "#152026",
    raised: "#1B282F",
    line: "#26363E",
    ink: "#DCE6EA",
    muted: "#9AAAB2",
    faint: "#6E7F87",
  },
};

// chart series, ordered so neighbours stay distinguishable in both modes
export const SERIES = [
  "#0E7C86",
  "#D9932E",
  "#6B4E9B",
  "#3E8E5E",
  "#C0504D",
  "#4A7FB5",
  "#9A8B3F",
  "#7D8C93",
];
export const GOOD = "#3E8E5E";
export const BAD = "#C0504D";
