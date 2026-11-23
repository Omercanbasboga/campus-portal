import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";

// native date input; keeps the old ([Date]) => void callback shape
function DatePicker({ value, onChange, input }) {
  const raw = Array.isArray(value) ? value[0] : value;
  const str = raw instanceof Date ? raw.toISOString().slice(0, 10) : (raw || "").slice(0, 10);
  return (
    <TextField
      type="date"
      fullWidth
      size="small"
      value={str}
      InputLabelProps={{ shrink: true }}
      onChange={(e) => onChange(e.target.value ? [new Date(`${e.target.value}T00:00:00`)] : [])}
      {...input}
    />
  );
}

DatePicker.propTypes = {
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.instanceOf(Date)]),
  onChange: PropTypes.func.isRequired,
  input: PropTypes.object,
};

export default DatePicker;
