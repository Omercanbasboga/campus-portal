import PropTypes from "prop-types";
import MuiAvatar from "@mui/material/Avatar";
// brighter than the chart series; avatars are small and need to pop
const AVATAR = ["#4F6BED", "#E0557A", "#0E9AA7", "#E89A2C", "#2FA36B", "#8B5CF6", "#3BA7E0", "#D2603A"];

const SIZE = { xs: 24, sm: 36, md: 48, lg: 64, xl: 80, xxl: 110 };

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toLocaleUpperCase("tr-TR"))
    .join("");
}

// No photo but a name -> coloured initials (stable colour per name), even if a
// placeholder icon was passed as children. No name -> render children as given.
function Avatar({ src, alt, size, variant, sx, children, ...rest }) {
  const px = SIZE[size] || SIZE.md;
  const seed = [...(alt || "")].reduce((a, c) => a + c.charCodeAt(0), 0);
  const useInitials = !src && Boolean(alt && alt.trim());
  const fill = AVATAR[seed % AVATAR.length];
  return (
    <MuiAvatar
      src={src || undefined}
      alt={alt}
      variant={variant === "rounded" ? "rounded" : "circular"}
      sx={{
        width: px,
        height: px,
        fontSize: px * 0.38,
        fontWeight: 600,
        ...(typeof sx === "object" ? sx : {}),
        ...(useInitials && { bgcolor: fill, backgroundColor: fill, color: "#fff" }),
      }}
      {...rest}
    >
      {useInitials ? initials(alt) : children}
    </MuiAvatar>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.string,
  variant: PropTypes.string,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  children: PropTypes.node,
};
Avatar.defaultProps = { size: "md", variant: "circular" };

export default Avatar;
