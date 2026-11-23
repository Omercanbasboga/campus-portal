import { forwardRef } from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Icon from "@mui/material/Icon";

// text input with an optional leading/trailing material icon
const Input = forwardRef(({ icon, size, error, success, inputProps, ...rest }, ref) => {
  const adornment = icon?.component && (
    <InputAdornment position={icon.direction === "right" ? "end" : "start"}>
      <Icon fontSize="small">{icon.component}</Icon>
    </InputAdornment>
  );
  return (
    <TextField
      inputRef={ref}
      fullWidth
      size={size === "large" ? "medium" : "small"}
      error={error}
      color={success ? "success" : "primary"}
      inputProps={inputProps}
      InputProps={{
        ...(adornment && icon.direction === "right"
          ? { endAdornment: adornment }
          : adornment && { startAdornment: adornment }),
      }}
      {...rest}
    />
  );
});

Input.propTypes = {
  icon: PropTypes.shape({ component: PropTypes.node, direction: PropTypes.string }),
  size: PropTypes.string,
  error: PropTypes.bool,
  success: PropTypes.bool,
  inputProps: PropTypes.object,
};

export default Input;
