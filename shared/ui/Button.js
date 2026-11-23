import { forwardRef } from "react";
import PropTypes from "prop-types";
import MuiButton from "@mui/material/Button";

const COLOR = { dark: "inherit", light: "inherit", white: "inherit", text: "secondary" };

// "gradient" in the pages just meant the solid primary style
const Button = forwardRef(({ variant, color, circular, iconOnly, sx, ...rest }, ref) => (
  <MuiButton
    ref={ref}
    variant={variant === "outlined" ? "outlined" : variant === "text" ? "text" : "contained"}
    color={COLOR[color] || color}
    sx={{
      ...(circular && { borderRadius: 999 }),
      ...(iconOnly && { minWidth: 0, p: 1 }),
      ...sx,
    }}
    {...rest}
  />
));

Button.propTypes = {
  variant: PropTypes.string,
  color: PropTypes.string,
  circular: PropTypes.bool,
  iconOnly: PropTypes.bool,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};
Button.defaultProps = { variant: "contained", color: "primary" };

export default Button;
