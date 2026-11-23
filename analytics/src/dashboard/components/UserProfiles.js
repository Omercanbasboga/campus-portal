import React, { useState, useEffect, useMemo } from "react";
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

import { getUserProfilesDashboard } from "../api/userProfilesService";

const getTheme = chartTheme;

function StatCard({ title, value, color, theme, isDark }) {
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
        <Text variant="h4" fontWeight="bold" sx={{ color: color || theme.textPrimary }} mt={0.5}>
          {value}
        </Text>
      </Box>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
  theme: PropTypes.object.isRequired,
  isDark: PropTypes.bool.isRequired,
};

function UserProfiles() {
  const [controller] = useUiController();
  const { darkMode } = controller;
  const THEME = useMemo(() => getTheme(darkMode), [darkMode]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserProfilesDashboard(10);
        setDashboardData(data);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const donutOptions = useMemo(
    () => ({
      chart: { type: "pie", backgroundColor: "transparent", height: 300 },
      title: { text: "" },
      tooltip: {
        backgroundColor: THEME.cardBg,
        style: { color: THEME.textPrimary },
        borderColor: THEME.gridLine,
      },
      plotOptions: {
        pie: {
          innerSize: "60%",
          borderWidth: 0,
          dataLabels: { enabled: false },
          showInLegend: true,
        },
      },
      legend: {
        itemStyle: { color: THEME.textGray, fontWeight: "normal", fontSize: "11px" },
        layout: "vertical",
        align: "left",
        verticalAlign: "top",
      },
      series: [
        {
          name: "Profil Sayısı",
          data: [
            {
              name: "Standart Profil",
              y: dashboardData?.aktifKullaniciSayisi,
              color: THEME.accentBlue,
            },
            {
              name: "Kritik Riskli Profil",
              y: dashboardData?.yuksekRiskKullaniciSayisi,
              color: THEME.accentRed,
            },
          ],
        },
      ],
      credits: { enabled: false },
    }),
    [THEME, dashboardData]
  );

  const distributionOptions = useMemo(
    () => ({
      chart: { type: "column", backgroundColor: "transparent", height: 300 },
      title: { text: "" },
      xAxis: {
        categories: dashboardData?.riskDagilimi?.map((item) => item.aralik) || [],
        labels: { style: { color: THEME.textGray, fontSize: "11px" } },
        lineColor: THEME.gridLine,
      },
      yAxis: {
        title: { text: "" },
        gridLineColor: THEME.gridLine,
        labels: { style: { color: THEME.textGray } },
      },
      tooltip: {
        backgroundColor: THEME.cardBg,
        style: { color: THEME.textPrimary },
        borderColor: THEME.gridLine,
      },
      legend: {
        itemStyle: { color: THEME.textGray, fontWeight: "normal" },
        align: "left",
        verticalAlign: "top",
      },
      plotOptions: { column: { borderWidth: 0, borderRadius: 2 } },
      series: [
        {
          name: "Kullanıcı Hacmi",
          data: dashboardData?.riskDagilimi?.map((item) => item.sayi) || [],
          color: THEME.accentGreen,
        },
      ],
      credits: { enabled: false },
    }),
    [THEME, dashboardData]
  );

  const topUsersOptions = useMemo(
    () => ({
      chart: { type: "bar", backgroundColor: "transparent", height: 500 },
      title: { text: "" },
      xAxis: {
        categories:
          dashboardData?.enCokGirisYapanlar?.map((user) => user.email.split("@")[0]) || [],
        labels: { style: { color: THEME.textGray, fontSize: "11px" } },
        lineColor: THEME.gridLine,
        gridLineWidth: 0,
      },
      yAxis: {
        title: { text: "" },
        gridLineColor: THEME.gridLine,
        labels: { style: { color: THEME.textGray } },
      },
      tooltip: {
        backgroundColor: THEME.cardBg,
        style: { color: THEME.textPrimary },
        borderColor: THEME.gridLine,
        shared: true,
      },
      legend: {
        itemStyle: { color: THEME.textGray, fontWeight: "normal" },
        align: "left",
        verticalAlign: "top",
      },
      plotOptions: { bar: { borderWidth: 0, borderRadius: 0, stacking: "normal" } },
      series: [
        {
          name: "Standart Oturumlar",
          color: THEME.accentBlue,
          data:
            dashboardData?.enCokGirisYapanlar?.map((user) =>
              !user.yuksekRisk ? user.toplamGiris : null
            ) || [],
        },
        {
          name: "Kritik Riskli Oturumlar",
          color: THEME.accentRed,
          data:
            dashboardData?.enCokGirisYapanlar?.map((user) =>
              user.yuksekRisk ? user.toplamGiris : null
            ) || [],
        },
      ],
      credits: { enabled: false },
    }),
    [THEME, dashboardData]
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
          Kullanıcı Profilleri ve Risk Analizi
        </Text>
        <Text variant="button" color="text" fontWeight="regular" display="block">
          Sistem kullanıcılarının davranışsal risk profilleri, oturum yoğunlukları ve güvenlik
          uyumluluk katsayılarının analiz edildiği izleme panelidir.
        </Text>
      </Box>

      <Grid container spacing={2} mb={4}>
        {[
          {
            t: "Analiz Edilen Toplam Kullanıcı",
            v: dashboardData.toplamKullanici.toLocaleString(),
          },
          {
            t: "Kritik Risk Seviyesindeki Kullanıcılar",
            v: dashboardData.yuksekRiskliSayisi.toLocaleString(),
            c: THEME.accentRed,
          },
          { t: "Genel Ortalama Risk Katsayısı", v: dashboardData.ortalamRiskSkoru.toFixed(2) },
          { t: "Kümülatif Oturum Hacmi", v: dashboardData.toplamGiris.toLocaleString() },
        ].map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.t}>
            <StatCard
              title={stat.t}
              value={stat.v}
              color={stat.c}
              theme={THEME}
              isDark={darkMode}
            />
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
                    Güvenlik Profil Dağılımı
                  </Text>
                  <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                    Kullanıcı tabanının davranışsal analiz sonuçlarına göre güvenlik profili bazında
                    oransal dağılımı.
                  </Text>
                  <HighchartsReact
                    key={`donut-${darkMode}`}
                    highcharts={Highcharts}
                    options={donutOptions}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Text variant="h6" color={darkMode ? "white" : "dark"}>
                    Risk Katsayısı Dağılım Matrisi
                  </Text>
                  <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                    Kullanıcıların risk puanlarının sayısal aralıklara göre frekans dağılımı;
                    anomali tespiti için istatistiksel eşik sağlar.
                  </Text>
                  <HighchartsReact
                    key={`dist-${darkMode}`}
                    highcharts={Highcharts}
                    options={distributionOptions}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none" }}>
        <Box p={3}>
          <Text variant="h6" color={darkMode ? "white" : "dark"}>
            En Yüksek Oturum Yoğunluğuna Sahip Kullanıcılar (İlk 10)
          </Text>
          <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
            Sistem üzerinde en yüksek trafik üreten kullanıcı hesaplarının güncel güvenlik
            statüleriyle birlikte hacimsel sıralaması.
          </Text>
          <HighchartsReact
            key={`top-${darkMode}`}
            highcharts={Highcharts}
            options={topUsersOptions}
          />
        </Box>
      </Card>
    </Box>
  );
}

export default UserProfiles;
