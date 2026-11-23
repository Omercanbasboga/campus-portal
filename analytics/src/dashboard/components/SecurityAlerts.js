import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

import Box from "ui/Box";
import chartTheme from "ui/chartTheme";
import Text from "ui/Text";
import Badge from "ui/Badge";

import { useUiController } from "ui/UiContext";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { getSecurityAlertsDashboard } from "../api/securityAlertsService";

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

function SecurityAlerts() {
  const [controller] = useUiController();
  const { darkMode } = controller;
  const THEME = useMemo(() => getTheme(darkMode), [darkMode]);
  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getSecurityAlertsDashboard();
        setAlertData(res);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const timelineOptions = useMemo(
    () => ({
      chart: { type: "column", backgroundColor: "transparent", height: 300 },
      title: { text: "" },
      xAxis: {
        categories: alertData?.saatlikAlarmlar?.map((s) => s.saatEtiket) || [],
        labels: { style: { color: THEME.textGray, fontSize: "11px" } },
        lineColor: THEME.gridLine,
      },
      yAxis: {
        title: { text: "" },
        gridLineColor: THEME.gridLine,
        labels: { style: { color: THEME.textGray } },
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
      plotOptions: { column: { borderWidth: 0, borderRadius: 2 } },
      series: [
        {
          name: "Client Yanıltma (Spoofing)",
          data: alertData?.saatlikAlarmlar?.map((s) => s.clientSpoofing) || [],
          color: THEME.accentRed,
        },
        {
          name: "Mesai Dışı Erişim",
          data: alertData?.saatlikAlarmlar?.map((s) => s.offHours) || [],
          color: THEME.accentOrange,
        },
      ],
      credits: { enabled: false },
    }),
    [THEME, alertData]
  );

  const commonPie = useMemo(
    () => ({
      chart: { type: "pie", backgroundColor: "transparent", height: 250 },
      title: { text: "" },
      plotOptions: {
        pie: {
          innerSize: "70%",
          borderWidth: 0,
          dataLabels: { enabled: false },
          showInLegend: true,
        },
      },
      legend: {
        itemStyle: { color: THEME.textGray, fontWeight: "normal", fontSize: "11px" },
        layout: "horizontal",
        align: "center",
        verticalAlign: "top",
      },
      credits: { enabled: false },
    }),
    [THEME]
  );

  const typeOptions = useMemo(() => {
    const adlandirma = {
      CLIENT_SPOOFING: { isim: "Client Yanıltma", renk: THEME.accentRed },
      OFF_HOURS: { isim: "Mesai Dışı Erişim", renk: THEME.accentOrange },
      TCKN_MISMATCH: { isim: "TCKN Uyuşmazlığı", renk: THEME.accentPurple },
    };

    const islenmisData =
      alertData?.alarmTuruDagilimi?.map((item) => {
        const kategori = adlandirma[item.alarmTuru] || {
          isim: item.alarmTuru,
          renk: THEME.textGray,
        };
        return {
          name: `${kategori.isim} (${item.sayi})`,
          y: item.sayi,
          color: kategori.renk,
        };
      }) || [];

    return {
      ...commonPie,
      series: [{ name: "İhlal Sayısı", data: islenmisData }],
    };
  }, [THEME, alertData, commonPie]);

  const ipOptions = useMemo(
    () => ({
      ...commonPie,
      series: [
        {
          name: "Kaynak IP Payı",
          data:
            alertData?.ipDagilimi?.slice(0, 5).map((item, idx) => ({
              name: `${item.ipAdresi} (${item.sayi})`,
              y: item.sayi,
              color: THEME.ipColors[idx % THEME.ipColors.length],
            })) || [],
        },
      ],
    }),
    [THEME, alertData, commonPie]
  );

  if (loading)
    return (
      <Box p={3} sx={{ display: "flex", justifyContent: "center", minHeight: "50vh" }}>
        <CircularProgress color="error" />
      </Box>
    );

  const maxAlarmCount =
    alertData?.topAlarmUretenler?.length > 0 ? alertData.topAlarmUretenler[0].toplamAlarm : 1;

  return (
    <Box p={3} sx={{ backgroundColor: THEME.mainBg, borderRadius: "1rem" }}>
      <Box mb={3}>
        <Text variant="h5" color={darkMode ? "white" : "dark"} fontWeight="bold">
          Güvenlik İhlalleri ve Risk Analizi
        </Text>
        <Text variant="button" color="text" fontWeight="regular" display="block">
          Sistem üzerinde tespit edilen şüpheli oturum hareketlerinin teknik risk raporu.
        </Text>
      </Box>

      <Grid container spacing={2} mb={3}>
        {[
          {
            t: "Toplam Güvenlik Alarmı",
            v: alertData?.toplamAlarm?.toLocaleString(),
            c: THEME.accentRed,
          },
          { t: "Client Yanıltma (Spoofing)", v: alertData?.clientSpoofingCount?.toLocaleString() },
          { t: "Mesai Dışı Erişim Kaydı", v: alertData?.offHoursCount?.toLocaleString() },
          { t: "Etkilenen Hesap Sayısı", v: alertData?.etkilenenHesap?.toLocaleString() },
        ].map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.t}>
            <StatCard
              title={stat.t}
              value={stat.v || "0"}
              color={stat.c}
              theme={THEME}
              isDark={darkMode}
            />
          </Grid>
        ))}
      </Grid>

      <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none", mb: 3 }}>
        <Box p={3}>
          <Text variant="h6" color={darkMode ? "white" : "dark"}>
            Kronolojik Risk Dağılımı
          </Text>
          <HighchartsReact
            key={`timeline-${darkMode}`}
            highcharts={Highcharts}
            options={timelineOptions}
            immutable={true}
          />
        </Box>
      </Card>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none", height: "100%" }}>
            <Box p={3}>
              <Text variant="h6" color={darkMode ? "white" : "dark"}>
                İhlal Kategorizasyonu
              </Text>
              <HighchartsReact
                key={`type-${darkMode}`}
                highcharts={Highcharts}
                options={typeOptions}
                immutable={true}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none", height: "100%" }}>
            <Box p={3}>
              <Text variant="h6" color={darkMode ? "white" : "dark"}>
                Kaynak IP Dağılımı (İlk 5)
              </Text>
              <HighchartsReact
                key={`ip-${darkMode}`}
                highcharts={Highcharts}
                options={ipOptions}
                immutable={true}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none" }}>
        <Box p={3}>
          <Text variant="h6" color={darkMode ? "white" : "dark"}>
            Yüksek Riskli Kullanıcı Profilleri (İlk 10)
          </Text>
          <Box mt={3}>
            {alertData?.topAlarmUretenler?.map((user, index) => {
              const displayName = user.email.split("@")[0];
              const isSpoofingHeavy = user.spoofingAlarm > user.toplamAlarm / 2;
              const barWidthPercent = (user.toplamAlarm / maxAlarmCount) * 100;

              return (
                <Box key={index} display="flex" alignItems="center" mb={2}>
                  <Box width="150px">
                    <Text variant="button" color={darkMode ? "white" : "dark"} fontWeight="medium">
                      {displayName}
                    </Text>
                  </Box>
                  <Box
                    width="100%"
                    ml={2}
                    mr={2}
                    sx={{ backgroundColor: THEME.barTrack, borderRadius: "4px" }}
                  >
                    <Box
                      sx={{
                        width: `${barWidthPercent}%`,
                        height: "12px",
                        backgroundColor: isSpoofingHeavy ? THEME.accentRed : THEME.accentOrange,
                        borderRadius: "4px",
                        opacity: 0.8,
                      }}
                    />
                  </Box>
                  <Box display="flex" alignItems="center" width="80px" justifyContent="flex-end">
                    <Text
                      variant="button"
                      color={darkMode ? "white" : "dark"}
                      fontWeight="bold"
                      mr={1}
                    >
                      {user.toplamAlarm}
                    </Text>
                    <Badge
                      variant="gradient"
                      badgeContent={
                        isSpoofingHeavy
                          ? `S:${user.spoofingAlarm}`
                          : `O:${user.toplamAlarm - user.spoofingAlarm}`
                      }
                      color={isSpoofingHeavy ? "error" : "warning"}
                      size="xs"
                      container
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

export default SecurityAlerts;
