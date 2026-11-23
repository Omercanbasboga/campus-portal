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

import { getClientAnalyticsDashboard } from "../api/clientAnalyticsService";

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

function ClientAnalytics() {
  const [controller] = useUiController();
  const { darkMode } = controller;
  const THEME = useMemo(() => getTheme(darkMode), [darkMode]);

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getClientAnalyticsDashboard();
        setAnalyticsData(res);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const barOptions = useMemo(() => {
    const categories = analyticsData?.topClientlar?.map((c) => c.clientAdi) || [];
    const seriesData = analyticsData?.topClientlar?.map((c) => c.toplamKullanim) || [];

    return {
      chart: { type: "bar", backgroundColor: "transparent", height: 500 },
      title: { text: "" },
      xAxis: {
        categories,
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
        borderColor: THEME.gridLine,
        valueSuffix: " etkileşim",
      },
      plotOptions: { bar: { borderRadius: 4, borderWidth: 0, color: THEME.blue } },
      series: [{ name: "Kullanım Hacmi", data: seriesData, showInLegend: false }],
      credits: { enabled: false },
    };
  }, [THEME, analyticsData]);

  const commonPie = {
    chart: { type: "pie", backgroundColor: "transparent", height: 300 },
    title: { text: "" },
    plotOptions: {
      pie: { innerSize: "70%", borderWidth: 0, dataLabels: { enabled: false }, showInLegend: true },
    },
    legend: { itemStyle: { color: THEME.textGray, fontWeight: "normal", fontSize: "11px" } },
    credits: { enabled: false },
  };

  const osOptions = useMemo(
    () => ({
      ...commonPie,
      tooltip: {
        backgroundColor: THEME.cardBg,
        style: { color: THEME.textPrimary },
        pointFormat: "Uygulama Sayısı: <b>{point.y}</b>",
      },
      series: [
        {
          name: "Sistem",
          data:
            analyticsData?.baskinOsDagilimi?.map((os, index) => ({
              name: `${os.osAdi} (${os.clientSayisi})`,
              y: os.clientSayisi,
              color: THEME.colors[index % THEME.colors.length],
            })) || [],
        },
      ],
    }),
    [THEME, analyticsData]
  );

  const browserOptions = useMemo(
    () => ({
      ...commonPie,
      tooltip: {
        backgroundColor: THEME.cardBg,
        style: { color: THEME.textPrimary },
        pointFormat: "Uygulama Sayısı: <b>{point.y}</b>",
      },
      series: [
        {
          name: "Tarayıcı",
          data:
            analyticsData?.baskinBrowserDagilimi?.map((browser, index) => ({
              name: `${browser.browserAdi} (${browser.clientSayisi})`,
              y: browser.clientSayisi,
              color: THEME.colors[index % THEME.colors.length],
            })) || [],
        },
      ],
    }),
    [THEME, analyticsData]
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
          Uygulama Bazlı Kullanım ve Verimlilik Analizi
        </Text>
        <Text variant="button" color="text" fontWeight="regular" display="block">
          Sisteme entegre olan farklı uygulamaların kullanım yoğunlukları ve bu uygulamaların baskın
          olarak çalıştığı teknik platformların dağılımı.
        </Text>
      </Box>

      <Grid container spacing={2} mb={3}>
        {[
          {
            t: "Toplam Etkileşim Hacmi",
            v: analyticsData?.toplamKullanim?.toLocaleString() || "0",
          },
          { t: "Kayıtlı Uygulama Sayısı", v: analyticsData?.clientSayisi?.toString() || "0" },
          {
            t: "En Yüksek Trafikli Uygulama",
            v: analyticsData?.enAktifClient
              ? `${
                  analyticsData.enAktifClient
                } (${analyticsData.enAktifClientKullanim.toLocaleString()})`
              : "-",
          },
          {
            t: "Uygulama Başına Ort. Etkileşim",
            v: analyticsData?.ortalamaKullanimPerClient?.toLocaleString() || "0",
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
              <Text variant="h6" color={darkMode ? "white" : "dark"}>
                En Yüksek Hacimli Uygulamalar (İlk 15)
              </Text>
              <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                Sistem kaynaklarını en yoğun kullanan ve en çok oturum tetikleyen entegre
                uygulamaların sıralaması.
              </Text>
              <HighchartsReact highcharts={Highcharts} options={barOptions} immutable={true} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none" }}>
            <Box p={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Text variant="h6" color={darkMode ? "white" : "dark"}>
                    Sistem Bazlı Uygulama Dağılımı
                  </Text>
                  <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                    Uygulamaların en sık çalıştığı işletim sistemi platformlarına göre sayısal
                    dağılımı.
                  </Text>
                  <HighchartsReact highcharts={Highcharts} options={osOptions} immutable={true} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Text variant="h6" color={darkMode ? "white" : "dark"}>
                    Tarayıcı Bazlı Uygulama Dağılımı
                  </Text>
                  <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                    Entegre uygulamaların en çok tercih edildiği web tarayıcı ekosistemlerine göre
                    dağılım analizi.
                  </Text>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={browserOptions}
                    immutable={true}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ClientAnalytics;
