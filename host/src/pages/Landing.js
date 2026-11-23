import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import Icon from "@mui/material/Icon";
import Box from "ui/Box";
import Text from "ui/Text";
import Button from "ui/Button";
import { APP_COLOR } from "ui/tokens";
import { isAuthenticated } from "auth/session";
import { REMOTES, REMOTE_URL } from "shell/remotes";
import HeroVisual from "./HeroVisual";

const REPO = "https://github.com/Omercanbasboga/campus-portal";

// fetch the remote's manifest right now, so the numbers on the page are real
function useProbe(key) {
  const [state, setState] = useState({ status: "checking" });
  useEffect(() => {
    let alive = true;
    const t0 = performance.now();
    fetch(`${REMOTE_URL[key]}/remoteEntry.js`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        const size = (await res.blob()).size;
        if (alive)
          setState({
            status: "up",
            ms: Math.round(performance.now() - t0),
            kb: (size / 1024).toFixed(1),
          });
      })
      .catch(() => alive && setState({ status: "down" }));
    return () => {
      alive = false;
    };
  }, [key]);
  return state;
}

function RemoteNode({ remote, signedIn }) {
  const probe = useProbe(remote.key);
  const statusText =
    probe.status === "checking"
      ? "Kontrol ediliyor"
      : probe.status === "up"
        ? `Yanıt verdi, ${probe.ms} ms`
        : "Şu an ulaşılamıyor";
  return (
    <Box
      component="article"
      sx={(t) => ({
        position: "relative",
        border: `1px solid ${t.palette.divider}`,
        borderTop: `4px solid ${remote.color}`,
        borderRadius: "14px",
        backgroundImage: `linear-gradient(180deg, ${remote.color}14, transparent 120px)`,
        boxShadow: `0 20px 40px -32px ${remote.color}`,
        bgcolor: "background.paper",
        p: { xs: 2.5, md: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      })}
    >
      <Box display="flex" alignItems="baseline" justifyContent="space-between" gap={2}>
        <Text variant="h5" component="h3">
          {remote.label}
        </Text>
        <Text
          variant="body2"
          sx={{ fontFamily: '"IBM Plex Sans Condensed"', color: remote.color, fontWeight: 600 }}
        >
          {remote.key}
        </Text>
      </Box>
      <Text variant="body2" color="text">
        {remote.summary}
      </Text>
      <Box
        component="dl"
        m={0}
        display="grid"
        gridTemplateColumns="auto 1fr"
        columnGap={2}
        rowGap={0.5}
        sx={{
          fontSize: "0.85rem",
          "& dt": { color: "text.secondary" },
          "& dd": { m: 0, fontWeight: 500 },
        }}
      >
        <dt>Durum</dt>
        <dd>
          <Box
            component="span"
            aria-hidden
            sx={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              mr: 0.75,
              bgcolor:
                probe.status === "up"
                  ? "success.main"
                  : probe.status === "down"
                    ? "error.main"
                    : "text.disabled",
            }}
          />
          {statusText}
        </dd>
        <dt>Manifest</dt>
        <dd>remoteEntry.js{probe.kb ? `, ${probe.kb} kB` : ""}</dd>
        <dt>Dışa açtığı</dt>
        <dd>./Routes</dd>
      </Box>
      <Box mt="auto" pt={1}>
        <Button
          component={RouterLink}
          to={
            signedIn
              ? `${remote.basePath}${remote.key === "records" ? "/dashboard" : "?bolum=trafik"}`
              : "/giris"
          }
          variant="outlined"
          sx={{ borderColor: remote.color, color: remote.color }}
        >
          {remote.label} uygulamasını aç
        </Button>
      </Box>
    </Box>
  );
}

RemoteNode.propTypes = { remote: PropTypes.object.isRequired, signedIn: PropTypes.bool.isRequired };

const NOTES = [
  [
    "rocket_launch",
    APP_COLOR.host,
    "Bağımsız yayın",
    "Analitik ve kayıtlar ayrı derlenip ayrı klasörlere yayınlanıyor. Birini güncellemek için kabuğu yeniden derlemek gerekmiyor.",
  ],
  [
    "layers",
    "#4A7FB5",
    "Tek kopya React",
    "React, router ve emotion kabukta bir kez yükleniyor; remote'lar aynı kopyayı kullanıyor. Sürüm uyuşmazsa webpack uyarı veriyor. Her uygulama MUI temasını kendisi kuruyor.",
  ],
  [
    "shield",
    APP_COLOR.analytics,
    "Hata yalıtımı",
    "Bir remote'un sunucusu düşerse sadece o bölüm hata gösteriyor; menü ve diğer uygulama çalışmaya devam ediyor.",
  ],
  [
    "timer",
    APP_COLOR.records,
    "Oturum bekçisi",
    "Süre dolunca zamanlayıcı kullanıcıyı anında çıkarıyor. Sekmeye geri dönüldüğünde tekrar kontrol ediyor, bir sekmede çıkış yapılınca diğerleri de kapanıyor.",
  ],
];

export default function Landing() {
  const signedIn = isAuthenticated();
  return (
    <Box
      minHeight="100vh"
      sx={(t) => ({
        bgcolor: "background.default",
        backgroundImage:
          t.palette.mode === "dark"
            ? `radial-gradient(900px 480px at 85% -10%, ${APP_COLOR.records}33, transparent 70%), radial-gradient(700px 420px at -10% 10%, ${APP_COLOR.host}2E, transparent 70%)`
            : `radial-gradient(900px 480px at 85% -10%, ${APP_COLOR.records}1F, transparent 70%), radial-gradient(700px 420px at -10% 10%, ${APP_COLOR.host}1F, transparent 70%), radial-gradient(600px 400px at 60% 40%, ${APP_COLOR.analytics}14, transparent 70%)`,
        backgroundRepeat: "no-repeat",
      })}
    >
      <Box
        component="header"
        maxWidth={1200}
        mx="auto"
        px={{ xs: 2, md: 4 }}
        py={2}
        display="flex"
        alignItems="center"
        gap={2}
      >
        <Box
          aria-hidden
          sx={{
            width: 26,
            height: 26,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2px",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <Box sx={{ gridColumn: "1 / 3", bgcolor: APP_COLOR.host }} />
          <Box sx={{ bgcolor: APP_COLOR.analytics }} />
          <Box sx={{ bgcolor: APP_COLOR.records }} />
        </Box>
        <Text variant="h6" component="span" flex={1}>
          Kampüs portalı
        </Text>
        <Button
          component="a"
          href={REPO}
          variant="text"
          color="secondary"
          sx={{ display: { xs: "none", sm: "inline-flex" } }}
        >
          Kaynak kod
        </Button>
        <Button component={RouterLink} to={signedIn ? "/analytics?bolum=trafik" : "/giris"}>
          {signedIn ? "Portala dön" : "Demo hesabıyla gir"}
        </Button>
      </Box>

      <Box component="main" maxWidth={1200} mx="auto" px={{ xs: 2, md: 4 }} pb={8}>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "1.05fr 1fr" }}
          alignItems="center"
          gap={{ xs: 5, md: 6 }}
          pt={{ xs: 4, md: 8 }}
          pb={{ xs: 6, md: 10 }}
        >
          <Box>
            <Text
              variant="h1"
              mb={3}
              sx={{
                fontSize: { xs: "2.3rem", md: "3.4rem" },
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                maxWidth: "16ch",
              }}
            >
              Üç ayrı React uygulaması, tek bir portal.
            </Text>
            <Text
              variant="body1"
              color="text"
              maxWidth="52ch"
              mb={4}
              sx={{ fontSize: "1.08rem", lineHeight: 1.65 }}
            >
              Kabuk girişi, menüyü ve oturum süresini yönetiyor. Oturum analitiği ve kayıtlar kendi
              sunucularından geliyor; tarayıcı onları bir sayfası ilk açıldığında Module Federation
              ile yüklüyor.
            </Text>
            <Box display="flex" gap={1.5} flexWrap="wrap">
              <Button
                component={RouterLink}
                to={signedIn ? "/records/organization-chart" : "/giris?devam=%2Frecords%2Forganization-chart"}
                size="large"
              >
                Organizasyon şemasını aç
              </Button>
              <Button
                component={RouterLink}
                to={signedIn ? "/analytics?bolum=trafik" : "/giris"}
                size="large"
                variant="outlined"
              >
                Analitiğe bak
              </Button>
            </Box>
          </Box>
          <HeroVisual />
        </Box>

        <Text variant="body1" color="text" maxWidth="62ch" mb={3}>
          Aşağıdaki iki kutu, her remote&apos;un kendi sunucusuna şu an gönderilen gerçek bir isteğin
          sonucunu gösteriyor.
        </Text>

        <Box component="section" aria-labelledby="harita">
          <Text id="harita" variant="h6" component="h2" mb={2}>
            Çalışma anında birleşen parçalar
          </Text>

          <Box
            sx={(t) => ({
              border: `1px solid ${t.palette.divider}`,
              borderTop: `4px solid ${APP_COLOR.host}`,
              borderRadius: "14px",
              backgroundImage: `linear-gradient(180deg, ${APP_COLOR.host}12, transparent 90px)`,
              bgcolor: "background.paper",
              p: { xs: 2.5, md: 3 },
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: { xs: 1, md: 4 },
            })}
          >
            <Text variant="h5" component="h3">
              Kabuk
            </Text>
            <Text variant="body2" color="text" flex={1} minWidth="28ch">
              Giriş, menü, tema, oturum bekçisi. React, router ve emotion&apos;ı paylaşılan tek kopya
              olarak sunuyor.
            </Text>
            <Text
              variant="body2"
              sx={{
                fontFamily: '"IBM Plex Sans Condensed"',
                color: APP_COLOR.host,
                fontWeight: 600,
              }}
            >
              host
            </Text>
          </Box>

          <Box
            aria-hidden
            sx={(t) => ({
              display: { xs: "none", md: "grid" },
              gridTemplateColumns: "1fr 1fr",
              height: 40,
              mx: "25%",
              borderLeft: `2px dashed ${t.palette.divider}`,
              borderRight: `2px dashed ${t.palette.divider}`,
            })}
          />
          <Box display={{ xs: "block", md: "none" }} height={16} />

          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
            gap={{ xs: 2, md: 4 }}
          >
            <RemoteNode remote={REMOTES.analytics} signedIn={signedIn} />
            <RemoteNode remote={REMOTES.records} signedIn={signedIn} />
          </Box>
        </Box>

        <Box
          component="dl"
          mt={{ xs: 6, md: 9 }}
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          columnGap={3}
          rowGap={3}
        >
          {NOTES.map(([icon, color, title, body]) => (
            <Box
              key={title}
              sx={(t) => ({
                display: "flex",
                gap: 2,
                p: 2.5,
                borderRadius: "14px",
                bgcolor: "background.paper",
                border: `1px solid ${t.palette.divider}`,
              })}
            >
              <Box
                aria-hidden
                sx={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  borderRadius: "12px",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  background: `linear-gradient(135deg, ${color}, ${color}B3)`,
                  boxShadow: `0 10px 20px -12px ${color}`,
                }}
              >
                <Icon>{icon}</Icon>
              </Box>
              <Box>
                <Text component="dt" variant="h6" mb={0.5}>
                  {title}
                </Text>
                <Text
                  component="dd"
                  variant="body2"
                  color="text"
                  m={0}
                  maxWidth="56ch"
                  sx={{ lineHeight: 1.65 }}
                >
                  {body}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>

        <Text variant="body2" color="text" mt={8} maxWidth="70ch">
          Veriler örnek veridir; kişiler ve birimler uydurmadır. Panellerin ilk hali iş yerinde
          yazdığım bir yönetim portalından geliyor, burada kurumdan bağımsız hale getirildi.{" "}
          <Box component="a" href="https://omercanbasboga.github.io" sx={{ color: "primary.main" }}>
            Ömer Can Başboğa
          </Box>
        </Text>
      </Box>
    </Box>
  );
}
