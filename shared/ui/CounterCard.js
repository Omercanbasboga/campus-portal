import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Box from "./Box";
import Text from "./Text";

function CounterCard({ count, title, description, color }) {
  return (
    <Card sx={{ height: "100%" }}>
      <Box p={2}>
        <Text variant="body2" fontWeight={600}>
          {title}
        </Text>
        <Text variant="h4" component="p" color={color} my={0.5}>
          {Number(count ?? 0).toLocaleString("tr-TR")}
        </Text>
        {description && (
          <Text variant="caption" color="text">
            {description}
          </Text>
        )}
      </Box>
    </Card>
  );
}

CounterCard.propTypes = {
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  color: PropTypes.string,
};
CounterCard.defaultProps = { count: 0, description: "", color: "primary" };

export default CounterCard;
