import { keyframes } from "@mui/system";
import Box from "ui/Box";
import Text from "ui/Text";
import { APP_COLOR } from "ui/tokens";

// A drawing of the portal itself: the shell frame with the two remotes slotting
// into it. The panes arrive one after the other on first paint, which is the
// whole idea of the project in one picture.
const slotIn = keyframes`
  from { opacity: 0; transform: translate(28px, -18px) rotate(1.5deg); }
  to   { opacity: 1; transform: none; }
`;

const BARS = [38, 52, 44, 70, 62, 88, 76];
const TREE = [
  [0, 70],
  [1, 56],
  [2, 44],
  [2, 50],
  [1, 62],
  [2, 40],
];

function Tag({ color, children }) {
  return (
    <Box
      component="span"
      sx={{
        position: "absolute",
        top: -11,
        right: 12,
        px: 1,
        py: "1px",
        borderRadius: "6px",
        bgcolor: color,
        color: "#fff",
        fontSize: "0.68rem",
        fontWeight: 600,
        fontFamily: '"IBM Plex Sans Condensed", sans-serif',
        boxShadow: `0 6px 14px -6px ${color}`,
      }}
    >
      {children}
    </Box>
  );
}

function Pane({ color, label, delay, children, sx }) {
  return (
    <Box
      sx={[
        (t) => ({
          position: "relative",
          borderRadius: "12px",
          bgcolor: "background.paper",
          border: `1.5px solid ${color}`,
          boxShadow: `0 18px 40px -24px ${color}`,
          p: 1.5,
          animation: `${slotIn} 650ms cubic-bezier(.2,.8,.2,1) ${delay}ms both`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          ...(t.palette.mode === "dark" && { bgcolor: "#18252C" }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Tag color={color}>{label}</Tag>
      {children}
    </Box>
  );
}

export default function HeroVisual() {
  return (
    <Box aria-hidden sx={{ position: "relative", width: "100%", maxWidth: 520, mx: "auto" }}>
      <Box
        sx={(t) => ({
          borderRadius: "18px",
          overflow: "visible",
          bgcolor: t.palette.mode === "dark" ? "#111C21" : "#FFFFFF",
          border: `1px solid ${t.palette.divider}`,
          boxShadow:
            t.palette.mode === "dark"
              ? "0 30px 60px -30px rgba(0,0,0,.8)"
              : "0 30px 60px -32px rgba(14,124,134,.45)",
        })}
      >
        {/* window chrome */}
        <Box
          sx={(t) => ({
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: 2,
            height: 36,
            borderBottom: `1px solid ${t.palette.divider}`,
          })}
        >
          {["#E5675B", "#E8B04A", "#5BB974"].map((c) => (
            <Box key={c} sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c }} />
          ))}
          <Box
            sx={{
              ml: 1.5,
              flex: 1,
              height: 18,
              borderRadius: "9px",
              bgcolor: "action.hover",
              px: 1.25,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Text variant="caption" sx={{ fontSize: "0.66rem", color: "text.secondary" }}>
              /campus-portal/records/organization-chart
            </Text>
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "64px 1fr", minHeight: 300 }}>
          {/* shell rail */}
          <Box
            sx={{
              position: "relative",
              bgcolor: APP_COLOR.host,
              borderBottomLeftRadius: "18px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.25,
              pt: 2,
            }}
          >
            {[1, 0.55, 0.55, 0.55].map((o, i) => (
              <Box
                key={i}
                sx={{
                  width: i === 0 ? 28 : 22,
                  height: i === 0 ? 28 : 22,
                  borderRadius: "7px",
                  bgcolor: `rgba(255,255,255,${o * 0.6})`,
                }}
              />
            ))}
            <Box
              component="span"
              sx={{
                position: "absolute",
                bottom: 14,
                fontSize: "0.62rem",
                fontWeight: 600,
                color: "rgba(255,255,255,.85)",
                fontFamily: '"IBM Plex Sans Condensed", sans-serif',
              }}
            >
              host
            </Box>
          </Box>

          <Box sx={{ p: 2.5, display: "grid", gap: 2.5, gridTemplateRows: "auto 1fr" }}>
            <Pane color={APP_COLOR.analytics} label="analytics" delay={250}>
              <Box display="flex" alignItems="flex-end" gap={0.75} height={64}>
                {BARS.map((h, i) => (
                  <Box
                    key={i}
                    sx={{
                      flex: 1,
                      height: `${h}%`,
                      borderRadius: "4px 4px 1px 1px",
                      bgcolor: APP_COLOR.analytics,
                      opacity: 0.35 + (i / BARS.length) * 0.65,
                    }}
                  />
                ))}
              </Box>
            </Pane>

            <Pane color={APP_COLOR.records} label="records" delay={550}>
              <Box display="grid" gap={0.9}>
                {TREE.map(([depth, w], i) => (
                  <Box key={i} display="flex" alignItems="center" gap={0.75} pl={depth * 2.25}>
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "4px",
                        bgcolor: ["#6B4E9B", "#4A7FB5", "#2FA39A"][depth],
                      }}
                    />
                    <Box
                      sx={{
                        height: 8,
                        width: `${w}%`,
                        borderRadius: "4px",
                        bgcolor: "action.selected",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Pane>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
