import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Box from "./Box";
import Text from "./Text";

// a filter tile: label plus an on/off switch
function ControllerCard({ title, description, icon, state, onChange, color }) {
  return (
    <Card
      sx={(t) => ({
        height: "100%",
        borderColor: state ? t.palette[color]?.main || t.palette.primary.main : t.palette.divider,
        bgcolor: state ? "action.selected" : "background.paper",
        transition: "border-color 120ms, background-color 120ms",
      })}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        px={2}
        py={1.25}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <Box>
            <Text variant="body2" fontWeight={600}>
              {title}
            </Text>
            {description && (
              <Text variant="caption" color="text">
                {description}
              </Text>
            )}
          </Box>
        </Box>
        <Switch
          size="small"
          checked={Boolean(state)}
          onChange={onChange}
          color={color === "dark" ? "default" : color}
          inputProps={{ "aria-label": title }}
        />
      </Box>
    </Card>
  );
}

ControllerCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.node,
  state: PropTypes.bool,
  onChange: PropTypes.func,
  color: PropTypes.string,
};
ControllerCard.defaultProps = {
  description: "",
  icon: null,
  state: false,
  onChange: () => {},
  color: "primary",
};

export default ControllerCard;
