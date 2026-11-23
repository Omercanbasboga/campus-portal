import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

// takes and returns {value, label} options, like react-select did
function Select({ options, value, defaultValue, onChange, placeholder, size }) {
  const current = (value || defaultValue)?.value ?? "";
  return (
    <TextField
      select
      fullWidth
      size={size === "large" ? "medium" : "small"}
      value={current}
      label={current === "" ? placeholder : undefined}
      onChange={(e) => onChange(options.find((o) => String(o.value) === String(e.target.value)))}
    >
      {options.map((o) => (
        <MenuItem key={o.value} value={o.value}>
          {o.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.any, label: PropTypes.node }))
    .isRequired,
  value: PropTypes.object,
  defaultValue: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  size: PropTypes.string,
};

export default Select;
