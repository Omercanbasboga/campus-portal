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

import heatmapModule from "highcharts/modules/heatmap";

import { getCohortAnalysisDashboard } from "../api/cohortAnalysisService";

if (typeof Highcharts === "object") {
  if (!Highcharts.seriesTypes.heatmap) {
    heatmapModule(Highcharts);
  }
}

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

function CohortAnalysis() {
  const [controller] = useUiController();
  const { darkMode } = controller;
  const THEME = useMemo(() => getTheme(darkMode), [darkMode]);
  const [cohortData, setCohortData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getCohortAnalysisDashboard();
        setCohortData(res);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const heatmapOptions = useMemo(() => {
    if (!cohortData?.heatmap) return {};
    const yCategories = cohortData.heatmap.map((row) => row.kayitHaftasi);
    let maxWeek = 0;
    const heatmapSeriesData = [];

    cohortData.heatmap.forEach((cohortRow, rowIndex) => {
      cohortRow.haftalar.forEach((hafta) => {
        if (hafta.kacinciHafta > maxWeek) maxWeek = hafta.kacinciHafta;
        heatmapSeriesData.push([
          hafta.kacinciHafta,
          rowIndex,
          parseFloat(hafta.eldeTutmaOrani.toFixed(1)),
        ]);
      });
    });

    const xCategories = Array.from({ length: maxWeek + 1 }, (_, i) =>
      i === 0 ? "Kayıt" : `${i}. Hafta`
    );

    return {
      chart: {
        type: "heatmap",
        backgroundColor: "transparent",
        height: Math.max(450, yCategories.length * 35),
        marginTop: 40,
      },
      title: { text: "" },
      credits: { enabled: false },
      xAxis: {
        categories: xCategories,
        labels: { style: { color: THEME.textGray, fontSize: "11px", fontWeight: "600" } },
        opposite: true,
        lineColor: "transparent",
        tickWidth: 0,
      },
      yAxis: {
        categories: yCategories,
        title: null,
        reversed: true,
        labels: { style: { color: THEME.textGray, fontSize: "12px", fontWeight: "600" } },
        gridLineWidth: 0,
      },
      colorAxis: {
        stops: [
          [0, THEME.stockRed],
          [0.1, THEME.stockDarkRed],
          [0.25, THEME.stockNeutral],
          [0.5, THEME.stockDarkGreen],
          [1, THEME.stockGreen],
        ],
        min: 0,
        max: 100,
        labels: { style: { color: THEME.textGray } },
      },
      legend: {
        align: "right",
        layout: "vertical",
        margin: 0,
        verticalAlign: "middle",
        symbolHeight: 280,
        title: { text: "Performans Oranı", style: { color: THEME.textGray, fontSize: "10px" } },
        itemStyle: { color: THEME.textGray },
      },
      tooltip: {
        backgroundColor: THEME.cardBg,
        style: { color: THEME.textPrimary },
        borderColor: THEME.gridBorder,
        shadow: false,
        borderRadius: 8,
      },
      plotOptions: {
        heatmap: {
          borderWidth: 2,
          borderColor: THEME.gridBorder,
          dataLabels: {
            enabled: true,
            color: "#FFFFFF",
            style: { textOutline: "none", fontSize: "11px", fontWeight: "700" },
            format: "%{point.value}",
          },
        },
      },
      series: [{ name: "Sadakat Oranı", data: heatmapSeriesData, borderWidth: 0 }],
    };
  }, [THEME, cohortData]);

  if (loading)
    return (
      <Box p={3} sx={{ display: "flex", justifyContent: "center", minHeight: "50vh" }}>
        <CircularProgress color="info" />
      </Box>
    );

  return (
    <Box p={3} sx={{ backgroundColor: THEME.mainBg, borderRadius: "1rem" }}>
      <Box mb={4}>
        <Text variant="h5" color={darkMode ? "white" : "dark"} fontWeight="bold">
          Kohort Analizi ve Kullanıcı Sadakat Matrisi
        </Text>
        <Text variant="button" color="text" fontWeight="regular" display="block">
          Kullanıcıların sisteme dahil oldukları dönemlere göre gruplandırılarak, sonraki
          süreçlerdeki geri dönüş ve sistemde kalma oranlarının zamansal dağılım analizi.
        </Text>
      </Box>

      <Grid container spacing={3} mb={4}>
        {[
          { t: "Analiz Edilen Hafta Sayısı", v: `${cohortData?.cohortSayisi || "0"} Hafta` },
          {
            t: "Ortalama Sadakat Oranı (1. Hafta)",
            v: `%${cohortData?.ort1HaftaTutma?.toFixed(1) || "0"}`,
          },
          {
            t: "Zirve Performans Dönemi",
            v: cohortData?.enIyiCohortHafta
              ? `${cohortData.enIyiCohortHafta} (%${cohortData.enIyiCohortOran.toFixed(1)})`
              : "-",
          },
        ].map((stat) => (
          <Grid item xs={12} sm={4} key={stat.t}>
            <StatCard title={stat.t} value={stat.v} theme={THEME} isDark={darkMode} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              backgroundColor: THEME.cardBg,
              boxShadow: "none",
              borderRadius: "1rem",
              overflowX: "auto",
            }}
          >
            <Box p={3} minWidth="900px">
              <Text variant="h6" color={darkMode ? "white" : "dark"} fontWeight="medium">
                Kullanıcı Elde Tutma (Retention) Isı Haritası
              </Text>
              <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                Kullanıcı gruplarının haftalık bazda sisteme geri dönüş oranlarını gösteren yoğunluk
                matrisi. Renk derinliği, sadakat oranındaki artışı temsil eder.
              </Text>
              <HighchartsReact
                key={`cohort-${darkMode}`}
                highcharts={Highcharts}
                options={heatmapOptions}
                immutable={true}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CohortAnalysis;
