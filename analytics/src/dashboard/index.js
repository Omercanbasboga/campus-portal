import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Highcharts from "highcharts";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";

import Box from "ui/Box";
import Text from "ui/Text";
import PageHero from "ui/PageHero";

import AppSystemTrends from "./components/AppSystemTrends";
import BrowserOsStats from "./components/BrowserOsStats";
import ClientAnalytics from "./components/ClientAnalytics";
import ClientTransitions from "./components/ClientTransitions";
import CohortAnalysis from "./components/CohortAnalysis";
import FuturePredictions from "./components/FuturePredictions";
import PeakPredictions from "./components/PeakPredictions";
import SecurityAlerts from "./components/SecurityAlerts";
import UserProfiles from "./components/UserProfiles";
import UserSegments from "./components/UserSegments";

Highcharts.setOptions({
  chart: { style: { fontFamily: '"IBM Plex Sans", system-ui, sans-serif' } },
  credits: { enabled: false },
  accessibility: { enabled: false },
  lang: { thousandsSep: ".", decimalPoint: "," },
});

const GROUPS = [
  {
    key: "trafik",
    label: "Trafik",
    intro: "Son yedi günün girişleri ve önümüzdeki günler için tahminler.",
    sections: [AppSystemTrends, PeakPredictions, FuturePredictions],
  },
  {
    key: "uygulamalar",
    label: "Cihaz ve uygulama",
    intro: "Hangi tarayıcı ve sistemlerden, hangi uygulamalara girildiği.",
    sections: [BrowserOsStats, ClientAnalytics, ClientTransitions],
  },
  {
    key: "kullanicilar",
    label: "Kullanıcılar",
    intro: "Kimlerin geri geldiği, kimin ne kadar kullandığı ve davranış grupları.",
    sections: [CohortAnalysis, UserProfiles, UserSegments],
  },
  {
    key: "guvenlik",
    label: "Güvenlik",
    intro: "Şüpheli oturumlar: istemci taklidi ve mesai dışı erişim.",
    sections: [SecurityAlerts],
  },
];

function Dashboard() {
  const [params, setParams] = useSearchParams();
  const initial = Math.max(
    0,
    GROUPS.findIndex((g) => g.key === params.get("bolum"))
  );
  const [tab, setTab] = useState(initial);

  useEffect(() => {
    // charts measure their container on mount; nudge them after a tab switch
    window.dispatchEvent(new Event("resize"));
  }, [tab]);

  const group = GROUPS[tab];
  const select = (_, i) => {
    setTab(i);
    setParams({ bolum: GROUPS[i].key }, { replace: true });
  };

  return (
    <Box px={{ xs: 2, md: 4 }} py={3} maxWidth={1440}>
      <PageHero
        tone="analytics"
        title="Oturum analitiği"
        description="Kampüs uygulamalarına yapılan girişler: ne zaman, hangi cihazdan, kim ve ne kadar güvenli. Veriler örnek veridir."
        stats={[
          ["Uygulama", 8, "apps"],
          ["Kullanıcı", "4.820", "groups"],
          ["Son 7 gün", "49.726 giriş", "login"],
        ]}
      />

      <Tabs
        value={tab}
        onChange={select}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
      >
        {GROUPS.map((g) => (
          <Tab key={g.key} label={g.label} />
        ))}
      </Tabs>

      <Text variant="body2" color="text" mb={2}>
        {group.intro}
      </Text>

      {group.sections.map((Section, i) => (
        <Box key={`${group.key}-${i}`}>
          {i > 0 && <Divider sx={{ my: 2 }} />}
          <Section />
        </Box>
      ))}
    </Box>
  );
}

export default Dashboard;
