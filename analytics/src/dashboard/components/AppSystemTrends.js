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
import treemapModule from "highcharts/modules/treemap";

import { getDashboardTrends, getChartTrends } from "../api/trendService";

if (typeof Highcharts === "object") {
  if (!Highcharts.seriesTypes.heatmap) heatmapModule(Highcharts);
  if (!Highcharts.seriesTypes.treemap) treemapModule(Highcharts);
}

const getTheme = chartTheme;

function StatCard({ title, value, theme, isDark }) {
  return (
    <Card
      sx={{
        backgroundColor: theme.cardBg,
        height: "100%",
        boxShadow: "none",
        backgroundImage: "none !important",
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

const generateLast7Days = () => {
  const days = [];
  const trDays = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dayName = trDays[d.getDay()];
    days.push({
      apiDashFormat: `${month}-${day} ${dayName}`,
      apiHeatmapFormat: `${d.getFullYear()}-${month}-${day}`,
      displayLabel: `${day} ${dayName.substring(0, 3)}`,
    });
  }
  return days;
};

function AppSystemTrends() {
  const [controller] = useUiController();
  const { darkMode } = controller;
  const THEME = useMemo(() => getTheme(darkMode), [darkMode]);

  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, chartRes] = await Promise.all([
          getDashboardTrends(),
          getChartTrends(),
        ]);
        setDashboardData(dashboardRes);
        setChartData(chartRes);
      } catch (error) {
        console.error("Veri yüklenemedi", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const commonOptions = useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        style: { fontFamily: "inherit" },
        borderWidth: 0,
        plotBorderWidth: 0,
      },
      credits: { enabled: false },
      title: { text: "" },
      tooltip: {
        backgroundColor: THEME.cardBg,
        style: { color: THEME.textHex },
        borderColor: THEME.gridLine,
        borderRadius: 8,
        shadow: false,
      },
    }),
    [THEME]
  );

  const columnOptions = useMemo(
    () => ({
      ...commonOptions,
      chart: { ...commonOptions.chart, type: "column", height: 280 },
      xAxis: {
        categories: generateLast7Days().map((d) => d.displayLabel),
        labels: { style: { color: THEME.textGray, fontSize: "11px" } },
        lineColor: THEME.gridLine,
        tickWidth: 0,
      },
      yAxis: {
        title: { text: "" },
        labels: { style: { color: THEME.textGray } },
        gridLineColor: THEME.gridLine,
      },
      plotOptions: {
        column: {
          borderRadius: 4,
          colorByPoint: true,
          borderWidth: 0,
          states: { hover: { brightness: 0.1 } },
        },
      },
      series: [
        {
          name: "Girişler",
          data: generateLast7Days().map((d) => {
            let val = 0;
            if (dashboardData?.gunlukGirisList) {
              const found = dashboardData.gunlukGirisList.find(
                (i) => i.tarihGun === d.apiDashFormat
              );
              if (found) val = found.toplamGiris;
            }
            return { y: val, color: THEME.accentBlue };
          }),
          showInLegend: false,
        },
      ],
    }),
    [THEME, commonOptions, dashboardData]
  );

  const treemapOptions = useMemo(() => {
    const treeData = [
      { id: "hafta_ici", name: "HAFTA İÇİ", color: THEME.cardBg },
      { id: "hafta_sonu", name: "HAFTA SONU", color: THEME.cardBg },
    ];

    if (dashboardData?.gunlukGirisList) {
      dashboardData.gunlukGirisList.forEach((item) => {
        const gunAdi = item.tarihGun.split(" ")[1] || "";
        const haftaSonuGunleri = ["Cumartesi", "Pazar"];
        const parent = haftaSonuGunleri.includes(gunAdi) ? "hafta_sonu" : "hafta_ici";

        const ortalama = dashboardData.ortalamaGun || 1;
        const sapmaYuzdesi = ((item.toplamGiris - ortalama) / ortalama) * 100;
        const clampedTrendScore = Math.max(-15, Math.min(15, sapmaYuzdesi));

        treeData.push({
          name: item.tarihGun,
          parent: parent,
          value: item.toplamGiris,
          colorValue: parseFloat(clampedTrendScore.toFixed(1)),
          gercekYuzde: sapmaYuzdesi,
        });
      });
    }

    return {
      ...commonOptions,
      chart: { ...commonOptions.chart, type: "treemap", height: 350 },
      colorAxis: {
        minColor: THEME.spRed,
        maxColor: THEME.spGreen,
        stops: [
          [0, THEME.spRed],
          [0.5, THEME.spNeutral],
          [1, THEME.spGreen],
        ],
        min: -15,
        max: 15,
        labels: { style: { color: THEME.textGray } },
      },
      tooltip: {
        backgroundColor: THEME.cardBg,
        style: { color: THEME.textHex },
        borderColor: THEME.gridLine,
        borderRadius: 8,
        useHTML: true,
        formatter: function () {
          if (this.point.id === "hafta_ici" || this.point.id === "hafta_sonu") {
            return `<b>${this.point.name}</b>`;
          }

          const sign = this.point.gercekYuzde >= 0 ? "+" : "";
          const color = this.point.gercekYuzde >= 0 ? THEME.spGreen : THEME.spRed;

          return `
              <div style="padding: 4px;">
                <b>${this.point.name}</b><br/>
                Ziyaret Sayısı: <b>${this.point.value}</b><br/>
                Haftalık Değişim: <span style="color: ${color}; font-weight: bold;">${sign}${this.point.gercekYuzde.toFixed(
                  1
                )}%</span>
              </div>
            `;
        },
      },
      plotOptions: {
        treemap: {
          layoutAlgorithm: "squarified",
          borderWidth: 2,
          borderColor: THEME.cardBg,
          dataLabels: {
            enabled: true,
            useHTML: true,
            formatter: function () {
              if (this.point.id === "hafta_ici" || this.point.id === "hafta_sonu") {
                return `<span style="color: ${THEME.textGray}; font-size: 11px;">${this.point.name}</span>`;
              }

              const sign = this.point.gercekYuzde >= 0 ? "+" : "";
              return `
                  <div style="text-align: center; color: #FFFFFF; font-family: inherit;">
                    <div style="font-size: 11px; font-weight: normal; opacity: 0.85;">${
                      this.point.name
                    }</div>
                    <div style="font-size: 14px; font-weight: bold; margin-top: 2px;">${sign}${this.point.gercekYuzde.toFixed(
                      1
                    )}%</div>
                  </div>
                `;
            },
          },
        },
      },
      series: [
        {
          name: "TÜMÜ",
          type: "treemap",
          data: treeData,
        },
      ],
    };
  }, [THEME, commonOptions, dashboardData]);

  const splineOptions = useMemo(() => {
    const seriesList = [];
    if (chartData?.saatlikTrend) {
      const last7 = chartData.saatlikTrend.slice(-7);
      const colors = THEME.colors.slice(1);
      last7.forEach((dayData, index) => {
        const dataArr = Array(24).fill(0);
        dayData.saatlikVeriler.forEach((v) => {
          const hour = parseInt(v.saat.split(":")[0], 10);
          if (!isNaN(hour) && hour >= 0 && hour < 24) dataArr[hour] = v.giris;
        });
        const isLastDay = index === last7.length - 1;
        seriesList.push({
          name: dayData.gunAdi,
          data: dataArr,
          color: isLastDay ? THEME.accentBlue : colors[index % colors.length],
          lineWidth: isLastDay ? 3 : 2,
          dashStyle: isLastDay ? "Solid" : "ShortDot",
        });
      });
    }
    return {
      ...commonOptions,
      chart: { ...commonOptions.chart, type: "spline", height: 300 },
      xAxis: {
        categories: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        tickInterval: 2,
        labels: { style: { color: THEME.textGray, fontSize: "11px" } },
        lineColor: THEME.gridLine,
      },
      yAxis: {
        title: { text: "" },
        labels: { style: { color: THEME.textGray } },
        gridLineColor: THEME.gridLine,
      },
      legend: {
        itemStyle: { color: THEME.textGray, fontWeight: "normal" },
        backgroundColor: "transparent",
      },
      series: seriesList.length > 0 ? seriesList : [{ name: "Bekleniyor", data: [] }],
    };
  }, [THEME, commonOptions, chartData]);

  const heatmapOptions = useMemo(() => {
    const last7Days = generateLast7Days();
    const heatmapData = [];
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) heatmapData.push([h, d, 0]);
    }
    if (chartData?.heatmap) {
      chartData.heatmap.forEach((item) => {
        const dayIndex = last7Days.findIndex((d) => d.apiHeatmapFormat === item.islemTarihi);
        if (dayIndex !== -1 && item.saat >= 0 && item.saat < 24) {
          heatmapData[dayIndex * 24 + item.saat][2] += item.giris;
        }
      });
    }
    return {
      ...commonOptions,
      chart: { ...commonOptions.chart, type: "heatmap", height: 320, marginTop: 40 },
      xAxis: {
        categories: Array.from({ length: 24 }, (_, i) => i.toString()),
        tickPositions: [0, 3, 6, 9, 12, 15, 18, 21],
        labels: { style: { color: THEME.textGray, fontSize: "11px" } },
        gridLineWidth: 0,
        lineColor: "transparent",
      },
      yAxis: {
        categories: last7Days.map((d) => d.displayLabel),
        reversed: true,
        labels: { style: { color: THEME.textGray, fontSize: "12px" } },
        gridLineWidth: 0,
      },
      colorAxis: {
        min: 0,
        minColor: THEME.cardBg,
        maxColor: THEME.accentBlue,
        labels: { style: { color: THEME.textGray } },
      },
      legend: {
        title: { text: "Az — Çok", style: { color: THEME.textGray, fontSize: "11px" } },
        itemStyle: { color: THEME.textGray },
      },
      plotOptions: {
        heatmap: {
          borderRadius: 5,
          borderWidth: 4,
          borderColor: THEME.cardBg,
        },
      },
      series: [
        {
          name: "Yoğunluk",
          data: heatmapData,
          dataLabels: { enabled: true, style: { textOutline: "none", color: THEME.textHex } },
        },
      ],
    };
  }, [THEME, commonOptions, chartData]);

  if (loading) {
    return (
      <Box
        p={3}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}
      >
        <CircularProgress color="info" />
      </Box>
    );
  }

  return (
    <Box
      p={3}
      sx={{
        backgroundColor: THEME.mainBg,
        borderRadius: "1rem",
        minHeight: "100%",
        transition: "background-color 0.3s ease",
      }}
    >
      <Box mb={4}>
        <Text variant="h5" color={darkMode ? "white" : "dark"} fontWeight="bold">
          Sistem Kullanım Trendleri
        </Text>
        <Text variant="button" color="text" fontWeight="regular">
          Son 7 günlük periyotta gerçekleşen sistem trafiği, kullanıcı etkileşim dinamikleri ve
          zaman bazlı operasyonel yoğunluk dağılımının analizi.
        </Text>
      </Box>

      <Grid container spacing={2} mb={4}>
        {[
          { label: "Toplam Ziyaret Sayısı", tooltip: "Son 7 gündeki toplam girişler" },
          { label: "En Kalabalık Gün", tooltip: "Sistemin en çok kullanıldığı gün" },
          { label: "Trafiğin Zirve Yaptığı Saat", tooltip: "Sistemin en yoğun olduğu an" },
          { label: "Günlük Ortalama Ziyaret", tooltip: "Günde ortalama kaç kez giriliyor" },
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <StatCard
              title={item.label}
              value={
                idx === 0
                  ? dashboardData?.toplamGiris?.toLocaleString()
                  : idx === 1
                    ? dashboardData?.enYogunGun
                    : idx === 2
                      ? dashboardData?.enYogunSaat
                      : dashboardData?.ortalamaGun?.toLocaleString() || "0"
              }
              theme={THEME}
              isDark={darkMode}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6} mb={3}>
          <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none", height: "100%" }}>
            <Box p={3}>
              <Text variant="h6" color={darkMode ? "white" : "dark"}>
                Son 7 Günün Ziyaretçi Özeti
              </Text>
              <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                Hangi gün sistemin ne kadar kullanıldığını gösterir. Yüksek çubuklar, o günkü
                yoğunluğun fazla olduğunu ifade eder.
              </Text>
              <HighchartsReact
                key={`col-${darkMode}`}
                highcharts={Highcharts}
                options={columnOptions}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6} mb={3}>
          <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none", height: "100%" }}>
            <Box p={3}>
              <Text variant="h6" color={darkMode ? "white" : "dark"}>
                Haftalık Trend
              </Text>
              <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                Yeşil renkler kullanımın yoğun olduğu günleri, kırmızı renkler ise sakin geçen
                günleri ifade eder.
              </Text>
              <HighchartsReact
                key={`tree-${darkMode}`}
                highcharts={Highcharts}
                options={treemapOptions}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={12} mb={3}>
          <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none" }}>
            <Box p={3}>
              <Text variant="h6" color={darkMode ? "white" : "dark"}>
                Günlük Kullanım Ritmi (Saat Saat)
              </Text>
              <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                İnsanların sabah, öğle veya akşam saatlerinden hangisinde daha aktif olduğunu
                gösteren çizgisel ritim haritasıdır.
              </Text>
              <HighchartsReact
                key={`spline-${darkMode}`}
                highcharts={Highcharts}
                options={splineOptions}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none" }}>
            <Box p={3}>
              <Text variant="h6" color={darkMode ? "white" : "dark"}>
                Sistemin En Sıcak (Yoğun) Anları
              </Text>
              <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                Hangi günün hangi saatinde sistemin kalabalık olduğunu gösterir. Koyu mavi
                kutucuklar trafiğin zirve yaptığı &quot;sıcak&quot; anları temsil eder.
              </Text>
              <HighchartsReact
                key={`heat-${darkMode}`}
                highcharts={Highcharts}
                options={heatmapOptions}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AppSystemTrends;
