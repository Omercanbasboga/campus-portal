import { forwardRef } from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";

const COLOR = {
  text: "text.secondary",
  secondary: "text.secondary",
  dark: "text.primary",
  white: "#fff",
  inherit: "inherit",
};

// Typography that accepts the short colour names the pages use
// ("text", "dark", "info", ...)
const Text = forwardRef(({ color, textGradient, opacity, sx, ...rest }, ref) => {
  let resolved = COLOR[color];
  if (!resolved && color)
    resolved = color.includes(".") || color.startsWith("#") ? color : `${color}.main`;
  return (
    <Typography
      ref={ref}
      color={resolved}
      sx={[{ ...(opacity !== undefined && { opacity }) }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...rest}
    />
  );
});

Text.propTypes = {
  color: PropTypes.string,
  textGradient: PropTypes.bool,
  opacity: PropTypes.number,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

export default Text;
