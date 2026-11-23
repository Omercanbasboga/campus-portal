import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import ButtonBase from "@mui/material/ButtonBase";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "ui/Box";
import Text from "ui/Text";
import Avatar from "ui/Avatar";
import { APP_COLOR } from "ui/tokens";
import { useUiController, setDarkMode } from "ui/UiContext";
import { currentUser, expiresAt, forceLogout } from "auth/session";
import { REMOTES } from "./remotes";

const RAIL = 252;

const NAV = [
  {
    remote: REMOTES.analytics,
    items: [
      { label: "Trafik", to: "/analytics?bolum=trafik", icon: "show_chart" },
      { label: "Cihaz ve uygulama", to: "/analytics?bolum=uygulamalar", icon: "devices" },
      { label: "Kullanıcılar", to: "/analytics?bolum=kullanicilar", icon: "groups" },
      { label: "Güvenlik", to: "/analytics?bolum=guvenlik", icon: "gpp_maybe" },
    ],
  },
  {
    remote: REMOTES.records,
    items: [
      { label: "Pano", to: "/records/dashboard", icon: "space_dashboard" },
      { label: "Personel", to: "/records/user-list", icon: "badge" },
      { label: "Öğrenciler", to: "/records/student-list", icon: "school" },
      { label: "Organizasyon şeması", to: "/records/organization-chart", icon: "account_tree" },
    ],
  },
];

function isActive(item, location) {
  const [path, query] = item.to.split("?");
  if (query) return location.pathname === path && location.search.includes(query);
  return location.pathname.startsWith(path);
}

function Countdown() {
  const [left, setLeft] = useState(expiresAt() - Date.now());
  useEffect(() => {
    const t = setInterval(() => setLeft(expiresAt() - Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.max(0, Math.floor(left / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return (
    <Tooltip title="Süre bitince oturum kapanır ve giriş sayfasına dönersiniz. Diğer sekmeler de birlikte kapanır.">
      <Text
        variant="body2"
        color="text"
        sx={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}
      >
        Oturum {mm}:{ss}
      </Text>
    </Tooltip>
  );
}

function Rail({ onNavigate }) {
  const location = useLocation();
  return (
    <Box display="flex" flexDirection="column" height="100%" py={2}>
      <ButtonBase
        component={RouterLink}
        to="/"
        onClick={onNavigate}
        sx={{ justifyContent: "flex-start", px: 2.5, pb: 2, gap: 1.25 }}
      >
        <Box
          aria-hidden
          sx={{
            width: 26,
            height: 26,
            borderRadius: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2px",
            overflow: "hidden",
          }}
        >
          <Box sx={{ gridColumn: "1 / 3", bgcolor: APP_COLOR.host }} />
          <Box sx={{ bgcolor: APP_COLOR.analytics }} />
          <Box sx={{ bgcolor: APP_COLOR.records }} />
        </Box>
        <Text variant="h6" component="span">
          Kampüs portalı
        </Text>
      </ButtonBase>

      <Box component="nav" aria-label="Uygulamalar" flex={1} px={1.5} sx={{ overflowY: "auto" }}>
        {NAV.map(({ remote, items }) => (
          <Box key={remote.key} mb={2.5}>
            <Box display="flex" alignItems="center" gap={1} px={1} mb={0.5}>
              <Box
                aria-hidden
                sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: remote.color }}
              />
              <Text variant="caption" fontWeight={600} color="text">
                {remote.label}
              </Text>
            </Box>
            {items.map((item) => {
              const active = isActive(item, location);
              return (
                <ButtonBase
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  sx={(t) => ({
                    width: "100%",
                    justifyContent: "flex-start",
                    gap: 1.25,
                    px: 1,
                    py: 0.85,
                    borderRadius: 1,
                    fontSize: "0.9rem",
                    fontWeight: active ? 600 : 500,
                    color: active ? "text.primary" : "text.secondary",
                    bgcolor: active ? t.palette.surface.raised : "transparent",
                    boxShadow: active ? `inset 3px 0 0 ${remote.color}` : "none",
                    "&:hover": { color: "text.primary", bgcolor: t.palette.surface.raised },
                  })}
                >
                  <Icon fontSize="small" sx={{ color: active ? remote.color : "inherit" }}>
                    {item.icon}
                  </Icon>
                  {item.label}
                </ButtonBase>
              );
            })}
          </Box>
        ))}
      </Box>

      <Box px={2.5} pt={2} sx={{ borderTop: 1, borderColor: "divider" }}>
        <Text variant="caption" color="text" component="p">
          Her bölüm ayrı derlenip yayınlanan bir uygulamadan geliyor.{" "}
          <Box component={RouterLink} to="/" onClick={onNavigate} sx={{ color: "primary.main" }}>
            Nasıl çalışıyor
          </Box>
        </Text>
      </Box>
    </Box>
  );
}

Rail.propTypes = { onNavigate: PropTypes.func };

export default function Shell({ children }) {
  const [{ darkMode }, dispatch] = useUiController();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null);
  const wide = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();
  const user = currentUser();

  const toggleDark = () => {
    setDarkMode(dispatch, !darkMode);
    try {
      localStorage.setItem("pref:dark", darkMode ? "0" : "1");
    } catch {
      // private mode: the toggle still works for this visit
    }
  };

  const rail = <Rail onNavigate={() => setOpen(false)} />;

  return (
    <Box display="flex" minHeight="100vh" bgcolor="background">
      {wide ? (
        <Box
          component="aside"
          sx={{
            width: RAIL,
            flexShrink: 0,
            position: "sticky",
            top: 0,
            height: "100vh",
            borderRight: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {rail}
        </Box>
      ) : (
        <Drawer open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: RAIL } }}>
          {rail}
        </Drawer>
      )}

      <Box flex={1} minWidth={0} display="flex" flexDirection="column">
        <Box
          component="header"
          display="flex"
          alignItems="center"
          gap={2}
          px={{ xs: 1.5, md: 3 }}
          sx={{
            height: 56,
            position: "sticky",
            top: 0,
            zIndex: 10,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {!wide && (
            <IconButton aria-label="Menüyü aç" onClick={() => setOpen(true)}>
              <Icon>menu</Icon>
            </IconButton>
          )}
          <Box flex={1} />
          <Countdown />
          <Tooltip title={darkMode ? "Açık tema" : "Koyu tema"}>
            <IconButton aria-label="Temayı değiştir" onClick={toggleDark}>
              <Icon>{darkMode ? "light_mode" : "dark_mode"}</Icon>
            </IconButton>
          </Tooltip>
          <ButtonBase
            aria-label="Hesap menüsü"
            onClick={(e) => setMenu(e.currentTarget)}
            sx={{ borderRadius: 999, gap: 1, pr: { xs: 0, sm: 1 } }}
          >
            <Avatar alt={user?.name || "Demo"} size="sm" />
            <Text variant="body2" fontWeight={600} sx={{ display: { xs: "none", sm: "block" } }}>
              {user?.name || "Demo kullanıcı"}
            </Text>
          </ButtonBase>
          <Menu anchorEl={menu} open={Boolean(menu)} onClose={() => setMenu(null)}>
            <MenuItem disabled>{user?.email}</MenuItem>
            <MenuItem
              onClick={() => {
                setMenu(null);
                navigate("/");
              }}
            >
              Mimari
            </MenuItem>
            <MenuItem onClick={() => forceLogout("cikis")}>Çıkış yap</MenuItem>
          </Menu>
        </Box>

        <Box component="main" flex={1} minWidth={0}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

Shell.propTypes = { children: PropTypes.node };
