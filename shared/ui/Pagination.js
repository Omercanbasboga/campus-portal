import PropTypes from "prop-types";
import ButtonBase from "@mui/material/ButtonBase";
import Box from "./Box";

// Used two ways, like before: <Pagination> wraps a row of <Pagination item>s.
function Pagination({ item, active, disabled, onClick, children }) {
  if (!item) {
    return (
      <Box display="flex" alignItems="center" gap={0.5} component="nav" aria-label="Sayfalar">
        {children}
      </Box>
    );
  }
  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      sx={(t) => ({
        minWidth: 32,
        height: 32,
        px: 1,
        borderRadius: 1,
        fontSize: "0.875rem",
        fontWeight: 600,
        border: `1px solid ${active ? t.palette.primary.main : t.palette.divider}`,
        bgcolor: active ? "primary.main" : "transparent",
        color: active ? "primary.contrastText" : "text.primary",
        opacity: disabled ? 0.4 : 1,
        "& .material-icons": { fontSize: 18 },
      })}
    >
      {children}
    </ButtonBase>
  );
}

Pagination.propTypes = {
  item: PropTypes.bool,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default Pagination;
