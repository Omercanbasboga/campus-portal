import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

import Box from "ui/Box";
import chartTheme from "ui/chartTheme";
import Text from "ui/Text";

import { useUiController } from "ui/UiContext";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { getBrowserOsDashboard } from "../api/browserOsService";

const getTheme = chartTheme;

function StatCard({ title, value, theme, isDark }) {
  return (
    <Card
      sx={{
        backgroundColor: theme.cardBg,
        height: "100%",
        boxShadow: "none",
        backgroundImage: "none",
      }}
    >
      <Box p={2.5}>
        <Text variant="button" fontWeight="medium" sx={{ color: theme.textGray }}>
          {title}
        </Text>
        <Text variant="h4" fontWeight="bold" color={isDark ? "white" : "dark"} mt={0.5}>
          {value}
        </Text>
      </Box>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  theme: PropTypes.object.isRequired,
  isDark: PropTypes.bool.isRequired,
};

function BrowserOsStats() {
  const [controller] = useUiController();
  const { darkMode } = controller;
  const THEME = useMemo(() => getTheme(darkMode), [darkMode]);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getBrowserOsDashboard();
        setStatsData(res);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const commonPieOptions = {
    chart: { type: "pie", backgroundColor: "transparent", height: 300 },
    title: { text: "" },
    plotOptions: {
      pie: { innerSize: "70%", borderWidth: 0, dataLabels: { enabled: false }, showInLegend: true },
    },
    legend: { itemStyle: { color: THEME.textGray, fontWeight: "normal", fontSize: "11px" } },
    credits: { enabled: false },
  };

  const browserOptions = useMemo(
    () => ({
      ...commonPieOptions,
      tooltip: {
        backgroundColor: THEME.cardBg,
        style: { color: THEME.textPrimary },
        borderColor: THEME.gridLine,
        pointFormat: "Oturum: <b>{point.kullanim}</b> (%{point.y})",
      },
      series: [
        {
          name: "Tarayıcı Payı",
          data:
            statsData?.browserDagilimi?.slice(0, 5).map((item, index) => ({
              name: `${item.ad} (%${item.yuzde})`,
              y: item.yuzde,
              kullanim: item.kullanimSayisi,
              color: THEME.colors[index % THEME.colors.length],
            })) || [],
        },
      ],
    }),
    [THEME, statsData]
  );

  const osOptions = useMemo(
    () => ({
      ...commonPieOptions,
      tooltip: {
        backgroundColor: THEME.cardBg,
        style: { color: THEME.textPrimary },
        borderColor: THEME.gridLine,
        pointFormat: "Oturum: <b>{point.kullanim}</b> (%{point.y})",
      },
      series: [
        {
          name: "Sistem Payı",
          data:
            statsData?.osDagilimi?.slice(0, 5).map((item, index) => ({
              name: `${item.ad} (%${item.yuzde})`,
              y: item.yuzde,
              kullanim: item.kullanimSayisi,
              color: THEME.colors[index % THEME.colors.length],
            })) || [],
        },
      ],
    }),
    [THEME, statsData]
  );

  const combinationOptions = useMemo(
    () => ({
      chart: { type: "bar", backgroundColor: "transparent", height: 450 },
      title: { text: "" },
      xAxis: {
        categories:
          statsData?.topKombinasyonlar?.slice(0, 10).map((i) => `${i.browserAdi} / ${i.osAdi}`) ||
          [],
        labels: { style: { color: THEME.textGray, fontSize: "11px" } },
        lineColor: THEME.gridLine,
      },
      yAxis: {
        gridLineColor: THEME.gridLine,
        title: { text: "" },
        labels: { style: { color: THEME.textGray } },
      },
      tooltip: {
        backgroundColor: THEME.cardBg,
        style: { color: THEME.textPrimary },
        valueSuffix: " oturum",
      },
      plotOptions: { bar: { borderRadius: 4, borderWidth: 0, colorByPoint: true } },
      series: [
        {
          name: "Oturum Sayısı",
          data: statsData?.topKombinasyonlar?.slice(0, 10).map((i) => i.kullanimSayisi) || [],
          showInLegend: false,
        },
      ],
      credits: { enabled: false },
    }),
    [THEME, statsData]
  );

  if (loading)
    return (
      <Box p={3} sx={{ display: "flex", justifyContent: "center", minHeight: "50vh" }}>
        <CircularProgress color="info" />
      </Box>
    );

  return (
    <Box p={3} sx={{ backgroundColor: THEME.mainBg, borderRadius: "1rem" }}>
      <Box mb={3}>
        <Text variant="h5" color={darkMode ? "white" : "dark"} fontWeight="bold">
          Erişim Kanalları ve Teknoloji Analizi
        </Text>
        <Text variant="button" color="text" fontWeight="regular" display="block">
          Sisteme erişim sağlayan kullanıcıların tarayıcı, işletim sistemi ve donanım
          konfigürasyonlarının dağılım analizi.
        </Text>
      </Box>

      <Grid container spacing={2} mb={3}>
        {[
          {
            t: "Toplam Analiz Edilen Oturum",
            v: statsData?.toplamKullanim?.toLocaleString() || "0",
          },
          { t: "Baskın Tarayıcı", v: statsData?.enCokBrowser || "-" },
          { t: "Baskın İşletim Sistemi", v: statsData?.enCokOs || "-" },
          {
            t: "Benzersiz Cihaz Konfigürasyonu",
            v: statsData?.farkliKombinasyon?.toLocaleString() || "0",
          },
        ].map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.t}>
            <StatCard title={stat.t} value={stat.v} theme={THEME} isDark={darkMode} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none" }}>
            <Box p={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Text variant="h6" color={darkMode ? "white" : "dark"}>
                    Tarayıcı Dağılımı
                  </Text>
                  <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                    Oturumların web tarayıcı tabanlı kullanım oranları.
                  </Text>
                  <HighchartsReact highcharts={Highcharts} options={browserOptions} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Text variant="h6" color={darkMode ? "white" : "dark"}>
                    İşletim Sistemi Dağılımı
                  </Text>
                  <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                    Erişim sağlanan cihazların işletim sistemi katmanı dağılımı.
                  </Text>
                  <HighchartsReact highcharts={Highcharts} options={osOptions} />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none" }}>
            <Box p={3}>
              <Text variant="h6" color={darkMode ? "white" : "dark"}>
                Teknoloji Matrisi (Top 10)
              </Text>
              <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                Tarayıcı ve işletim sistemi eşleşmelerine göre en yüksek yoğunluklu erişim
                profilleri.
              </Text>
              <HighchartsReact highcharts={Highcharts} options={combinationOptions} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default BrowserOsStats;
