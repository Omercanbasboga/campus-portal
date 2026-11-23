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

import { getPeakPredictionsDashboard } from "../api/peakPredictionsService";

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
          <Text variant="caption" sx={{ color: theme.textSecondary, display: "block", mt: 0.5 }}>
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

function PeakPredictions() {
  const [controller] = useUiController();
  const { darkMode } = controller;
  const THEME = useMemo(() => getTheme(darkMode), [darkMode]);
  const [peakData, setPeakData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getPeakPredictionsDashboard();
        setPeakData(res);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartOptions = useMemo(() => {
    const categories = peakData?.saatlikTahminler?.map((s) => s.zamanEtiket) || [];
    const chartData =
      peakData?.saatlikTahminler?.map((s) => ({
        y: s.beklenenGiris,
        color: s.yuksekYogunluk ? THEME.accentRed : THEME.accentBlue,
      })) || [];
    const rawData = peakData?.saatlikTahminler?.map((s) => s.beklenenGiris) || [];

    const maxVal = rawData.length > 0 ? Math.max(...rawData) : 24;
    const yAxisMax = Math.ceil(maxVal / 4) * 4;

    return {
      chart: { backgroundColor: "transparent", height: 400 },
      title: { text: "" },
      xAxis: {
        categories,
        labels: { style: { color: THEME.textGray, fontSize: "11px" }, rotation: -45, step: 2 },
        lineColor: THEME.gridLine,
        tickWidth: 0,
      },
      yAxis: {
        title: { text: "" },
        gridLineColor: THEME.gridLine,
        labels: { style: { color: THEME.textGray } },
        min: 0,
        max: yAxisMax,
        tickInterval: Math.max(1, Math.round(yAxisMax / 5)),
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
      plotOptions: {
        column: { borderWidth: 0, groupPadding: 0, pointPadding: 0.1 },
        spline: {
          lineWidth: 2,
          marker: {
            enabled: true,
            radius: 3,
            fillColor: THEME.cardBg,
            lineColor: THEME.accentBlue,
            lineWidth: 2,
          },
        },
      },
      series: [
        {
          type: "column",
          name: "Standart Yoğunluk",
          data: chartData,
          color: THEME.accentBlue,
          zIndex: 1,
        },
        {
          type: "spline",
          name: "Tahmini Etkileşim Eğrisi",
          data: rawData,
          color: THEME.accentBlue,
          zIndex: 2,
        },
        { type: "column", name: "Kritik Yoğunluk (Peak)", color: THEME.accentRed, data: [] },
      ],
      credits: { enabled: false },
    };
  }, [THEME, peakData]);

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
          Sistem Yoğunluk ve Darboğaz Analizi
        </Text>
        <Text variant="button" color="text" fontWeight="regular" display="block">
          Sistem kaynaklarının gelecek periyottaki saatlik kullanım yoğunluklarının projeksiyonu ve
          olası darboğaz (peak) noktalarının önceden tespiti.
        </Text>
      </Box>

      <Grid container spacing={2} mb={3}>
        {[
          { t: "Toplam Öngörülen Etkileşim", v: peakData?.toplamTahmin?.toLocaleString() || "0" },
          {
            t: "Zirve Yoğunluk Kapasitesi",
            v: `${peakData?.zirveGiris?.toLocaleString() || "0"} Oturum`,
            s: peakData?.zirveSaatEtiket,
          },
          {
            t: "Kritik Yoğunluk Süresi",
            v: `${peakData?.yuksekYogunlukSaat?.toLocaleString() || "0"} Saat`,
          },
          {
            t: "Standart Operasyon Süresi",
            v: `${peakData?.normalSaat?.toLocaleString() || "0"} Saat`,
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

      <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none" }}>
        <Box p={3}>
          <Text variant="h6" color={darkMode ? "white" : "dark"}>
            Saatlik Hacim ve Yoğunluk Projeksiyonu
          </Text>
          <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
            Saatlik bazda beklenen kullanıcı trafiği. Kırmızı sütunlar, sistemin standart operasyon
            kapasitesinin üzerine çıktığı ve performans riskinin arttığı zaman dilimlerini temsil
            eder.
          </Text>
          <HighchartsReact
            key={`peak-${darkMode}`}
            highcharts={Highcharts}
            options={chartOptions}
            immutable={true}
          />
        </Box>
      </Card>
    </Box>
  );
}

export default PeakPredictions;
