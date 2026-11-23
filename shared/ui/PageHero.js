import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import { useTheme } from "@mui/material/styles";
import Box from "./Box";
import Text from "./Text";

// Page header band. The gradient is the app's colour family, so a glance at
// the top of the page tells you which app you're in.
const GRADIENT = {
  analytics: {
    light: "linear-gradient(120deg, #B4561F 0%, #D9932E 55%, #E8B84A 100%)",
    dark: "linear-gradient(120deg, #3A2414 0%, #3A2D17 55%, #2E2A16 100%)",
  },
  records: {
    light: "linear-gradient(120deg, #6B4E9B 0%, #4F6BED 55%, #0E9AA7 100%)",
    dark: "linear-gradient(120deg, #2A1F45 0%, #1C2C44 55%, #10343A 100%)",
  },
};

function PageHero({ title, description, stats, tone, children }) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const g = GRADIENT[tone] || GRADIENT.records;
  return (
    <Box
      mb={3}
      p={{ xs: 2.5, md: 3.5 }}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        color: "#fff",
        background: dark ? g.dark : g.light,
        border: dark ? `1px solid ${theme.palette.divider}` : "none",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          maskImage: "linear-gradient(90deg, transparent 20%, black 75%)",
        }}
      />
      <Box
        position="relative"
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        gap={3}
      >
        <Box maxWidth="56ch">
          <Text variant="h2" component="h1" sx={{ color: "#fff" }}>
            {title}
          </Text>
          {description && (
            <Text variant="body1" sx={{ color: "rgba(255,255,255,0.86)", mt: 1 }}>
              {description}
            </Text>
          )}
          {children}
        </Box>
        {stats?.length > 0 && (
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr 1fr", sm: `repeat(${stats.length}, auto)` }}
            gap={{ xs: 1.5, sm: 3.5 }}
            alignSelf="flex-end"
          >
            {stats.map(([label, value, icon]) => (
              <Box key={label}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.75}
                  sx={{ color: "rgba(255,255,255,0.82)" }}
                >
                  {icon && <Icon sx={{ fontSize: 16 }}>{icon}</Icon>}
                  <Text variant="caption" sx={{ color: "inherit" }}>
                    {label}
                  </Text>
                </Box>
                <Text variant="h4" component="p" sx={{ color: "#fff", fontSize: "1.9rem" }}>
                  {value}
                </Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

PageHero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  stats: PropTypes.arrayOf(PropTypes.array),
  tone: PropTypes.oneOf(["analytics", "records"]),
  children: PropTypes.node,
};
PageHero.defaultProps = { description: null, stats: [], tone: "records", children: null };

export default PageHero;
