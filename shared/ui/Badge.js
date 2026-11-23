import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";

// label-style badge (the pages use it as a coloured pill, not a counter)
function Badge({ badgeContent, color, size, variant }) {
  return (
    <Chip
      label={badgeContent}
      color={color === "dark" || color === "light" ? "default" : color}
      size="small"
      variant={variant === "outlined" ? "outlined" : "filled"}
      sx={{
        fontWeight: 700,
        textTransform: "uppercase",
        fontSize: size === "xs" ? "0.65rem" : "0.75rem",
        height: size === "xs" ? 20 : 24,
      }}
    />
  );
}

Badge.propTypes = {
  badgeContent: PropTypes.node,
  color: PropTypes.string,
  size: PropTypes.string,
  variant: PropTypes.string,
};
Badge.defaultProps = { badgeContent: "", color: "info", size: "sm", variant: "gradient" };

export default Badge;
