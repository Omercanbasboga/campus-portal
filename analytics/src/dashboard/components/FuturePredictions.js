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

import highchartsMore from "highcharts/highcharts-more";

import { getFuturePredictionsDashboard } from "../api/futurePredictionsService";

if (typeof Highcharts === "object") {
  if (!Highcharts.seriesTypes.arearange) {
    highchartsMore(Highcharts);
  }
}

const getTheme = chartTheme;

function StatCard({ title, value, subtitle, theme, isDark }) {
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
        {subtitle && (
          <Text variant="caption" sx={{ color: theme.textSecondary }}>
            {subtitle}
          </Text>
        )}
      </Box>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  theme: PropTypes.object.isRequired,
  isDark: PropTypes.bool.isRequired,
};

function FuturePredictions() {
  const [controller] = useUiController();
  const { darkMode } = controller;
  const THEME = useMemo(() => getTheme(darkMode), [darkMode]);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getFuturePredictionsDashboard();
        setPredictionData(res);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartOptions = useMemo(() => {
    const categories =
      predictionData?.gunlukTahminler?.map((g) => g.tarihEtiket || g.tahminTarihi) || [];
    const lineData = predictionData?.gunlukTahminler?.map((g) => g.beklenenGiris) || [];
    const rangeData = predictionData?.gunlukTahminler?.map((g) => [g.altSinir, g.ustSinir]) || [];

    return {
      chart: { backgroundColor: "transparent", height: 400 },
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
        min: 0,
      },
      legend: {
        itemStyle: { color: THEME.textGray, fontWeight: "normal" },
        align: "left",
        verticalAlign: "top",
      },
      tooltip: {
        backgroundColor: THEME.cardBg,
        style: { color: THEME.textPrimary },
        borderColor: THEME.gridLine,
        shared: true,
      },
      series: [
        {
          name: "Öngörülen Erişim",
          data: lineData,
          zIndex: 1,
          color: THEME.accentBlue,
          marker: { fillColor: THEME.cardBg, lineWidth: 2, lineColor: THEME.accentBlue },
        },
        {
          name: "Güven Toleransı (%95)",
          data: rangeData,
          type: "arearange",
          lineWidth: 0,
          linkedTo: ":previous",
          color: THEME.accentBlue,
          fillOpacity: 0.1,
          zIndex: 0,
          marker: { enabled: false },
        },
      ],
      credits: { enabled: false },
    };
  }, [THEME, predictionData]);

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
          Yapay Zeka Destekli Erişim Projeksiyonları
        </Text>
        <Text variant="button" color="text" fontWeight="regular" display="block">
          Geçmiş veri setleri üzerinden makine öğrenmesi algoritmaları kullanılarak hesaplanan,
          gelecek 7 güne ait tahmini trafik hacmi ve güven aralığı analizi.
        </Text>
      </Box>

      <Grid container spacing={2} mb={3}>
        {[
          {
            t: "Maksimum Tahmin Hacmi",
            v: predictionData?.enYuksekTahmin?.toLocaleString() || "0",
            s: predictionData?.enYuksekTahminTarihi,
          },
          {
            t: "Minimum Tahmin Hacmi",
            v: predictionData?.enDusukTahmin?.toLocaleString() || "0",
            s: predictionData?.enDusukTahminTarihi,
          },
          {
            t: "Kümülatif Haftalık Beklenti",
            v: predictionData?.haftalikToplam?.toLocaleString() || "0",
          },
          {
            t: "Ortalama Güven Toleransı",
            v: `±${predictionData?.ortGuvenAraligi?.toLocaleString() || "0"}`,
          },
        ].map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.t}>
            <StatCard
              title={stat.t}
              value={stat.v}
              subtitle={stat.s}
              theme={THEME}
              isDark={darkMode}
            />
          </Grid>
        ))}
      </Grid>

      <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none", mb: 3 }}>
        <Box p={3}>
          <Text variant="h6" color={darkMode ? "white" : "dark"}>
            7 Günlük Projeksiyonel Erişim Tahmini
          </Text>
          <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
            Mavi çizgi en olası trafik beklentisini, gölgeli alan ise tahmin modelinin %95 güven
            oranıyla içinde kalmayı hedeflediği aşağı ve yukarı yönlü sapma sınırlarını temsil eder.
          </Text>
          <HighchartsReact
            key={`future-${darkMode}`}
            highcharts={Highcharts}
            options={chartOptions}
            immutable={true}
          />
        </Box>
      </Card>

      <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none" }}>
        <Box p={3}>
          <Text variant="h6" color={darkMode ? "white" : "dark"}>
            Günlük Tahmin Veri Seti
          </Text>
          <Text variant="button" color="text" fontWeight="regular" mb={3} display="block">
            Hesaplanan günlük alt ve üst eşik değerleri ile tahmin edilen merkezi değerlerin sayısal
            kırılımı.
          </Text>
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${THEME.border}` }}>
                  <th style={{ textAlign: "left", padding: "12px", color: THEME.textGray }}>
                    Tahmin Tarihi
                  </th>
                  <th style={{ textAlign: "center", padding: "12px", color: THEME.textGray }}>
                    Minimum Eşik
                  </th>
                  <th style={{ textAlign: "center", padding: "12px", color: THEME.textGray }}>
                    Öngörülen Değer
                  </th>
                  <th style={{ textAlign: "center", padding: "12px", color: THEME.textGray }}>
                    Maksimum Eşik
                  </th>
                  <th style={{ textAlign: "right", padding: "12px", color: THEME.textGray }}>
                    Tolerans Payı
                  </th>
                </tr>
              </thead>
              <tbody>
                {predictionData?.gunlukTahminler?.map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom:
                        index !== predictionData.gunlukTahminler.length - 1
                          ? `1px solid ${THEME.border}`
                          : "none",
                    }}
                  >
                    <td style={{ padding: "12px" }}>
                      <Text variant="button" color={darkMode ? "white" : "dark"}>
                        {row.tarihEtiket || row.tahminTarihi}
                      </Text>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <Text variant="button" sx={{ color: THEME.textSecondary }}>
                        {row.altSinir}
                      </Text>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <Text
                        variant="button"
                        color={
                          row.beklenenGiris === predictionData.enYuksekTahmin
                            ? "info"
                            : row.beklenenGiris === predictionData.enDusukTahmin
                              ? "error"
                              : darkMode
                                ? "white"
                                : "dark"
                        }
                        fontWeight="bold"
                      >
                        {row.beklenenGiris}
                      </Text>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <Text variant="button" sx={{ color: THEME.textSecondary }}>
                        {row.ustSinir}
                      </Text>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <Text variant="button" sx={{ color: THEME.textSecondary }}>
                        ±{row.aralikGenisligi}
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

export default FuturePredictions;
