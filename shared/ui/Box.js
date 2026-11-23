import { forwardRef } from "react";
import PropTypes from "prop-types";
import MuiBox from "@mui/material/Box";

const RADIUS = { none: 0, xs: 2, sm: 4, md: 8, lg: 12, xl: 16, xxl: 20, section: 160 };
const SHADOW = {
  none: "none",
  xs: "0 1px 5px rgba(0,0,0,0.08)",
  sm: "0 2px 10px rgba(0,0,0,0.08)",
  md: "0 4px 18px rgba(0,0,0,0.10)",
  lg: "0 8px 26px -4px rgba(20,20,20,0.15)",
  xl: "0 23px 45px -11px rgba(20,20,20,0.25)",
};

const paletteColor = (c) => (c && !c.startsWith("#") && !c.includes("(") ? `${c}.main` : c);

// MUI Box plus a few shorthand props used all over the pages
const Box = forwardRef(({ bgColor, borderRadius, shadow, opacity, sx, variant, ...rest }, ref) => (
  <MuiBox
    ref={ref}
    // sx may be an object, a function of the theme or an array; keep all three working
    sx={[
      {
        ...(bgColor && bgColor !== "transparent" && { bgcolor: paletteColor(bgColor) }),
        ...(borderRadius !== undefined && {
          borderRadius: `${RADIUS[borderRadius] ?? borderRadius}px`,
        }),
        ...(shadow && { boxShadow: SHADOW[shadow] ?? shadow }),
        ...(opacity !== undefined && { opacity }),
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    {...rest}
  />
));

Box.propTypes = {
  bgColor: PropTypes.string,
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  shadow: PropTypes.string,
  opacity: PropTypes.number,
  variant: PropTypes.string,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

export default Box;
