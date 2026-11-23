import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";

import Box from "ui/Box";
import chartTheme from "ui/chartTheme";
import Text from "ui/Text";
import Badge from "ui/Badge";

import { useUiController } from "ui/UiContext";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { getUserSegmentsDashboard, getAllUserSegments } from "../api/userSegmentService";

const getTheme = chartTheme;

const getClusterColor = (id, theme) => {
  if (id === 0) return theme.cluster0;
  if (id === 1) return theme.cluster1;
  if (id === 2) return theme.cluster2;
  return theme.textGray;
};

function SegmentStatCard({ title, count, description, borderColor, theme, isDark }) {
  return (
    <Card
      sx={{
        backgroundColor: theme.cardBg,
        height: "100%",
        boxShadow: "none",
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: "8px",
        backgroundImage: "none",
      }}
    >
      <Box p={2}>
        <Text variant="caption" fontWeight="medium" sx={{ color: theme.textGray }}>
          {title}
        </Text>
        <Text variant="h5" fontWeight="bold" color={isDark ? "white" : "dark"} mt={0.5}>
          {count} Kullanıcı
        </Text>
        <Text variant="caption" sx={{ color: theme.textSecondary }}>
          {description}
        </Text>
      </Box>
    </Card>
  );
}

SegmentStatCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string.isRequired,
  borderColor: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  isDark: PropTypes.bool.isRequired,
};

function UserSegments() {
  const [controller] = useUiController();
  const { darkMode } = controller;
  const THEME = useMemo(() => getTheme(darkMode), [darkMode]);

  const [dashboardData, setDashboardData] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handlePageChange = (event, value) => setPage(value);
  const currentUsers = userList.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(userList.length / rowsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashRes, listRes] = await Promise.all([
          getUserSegmentsDashboard(),
          getAllUserSegments(),
        ]);

        setDashboardData(dashRes);
        setUserList(listRes && listRes.length > 0 ? listRes : dashRes?.scatterVerisi || []);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const donutOptions = useMemo(() => {
    if (!dashboardData) return {};

    const pieData = dashboardData.clusterOzetleri.map((c) => ({
      name: c.clusterEtiket,
      y: c.kullaniciSayisi,
      color: getClusterColor(c.clusterId, THEME),
    }));

    return {
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
      series: [{ name: "Kullanıcı Sayısı", data: pieData }],
      credits: { enabled: false },
    };
  }, [THEME, dashboardData]);

  const columnOptions = useMemo(() => {
    if (!dashboardData) return {};

    const categories = dashboardData.clusterOzetleri.map((c) => c.clusterEtiket);
    const seriesData = dashboardData.clusterOzetleri.map((c) => ({
      y: c.toplamGiris,
      color: getClusterColor(c.clusterId, THEME),
    }));

    return {
      chart: { type: "column", backgroundColor: "transparent", height: 300 },
      title: { text: "" },
      xAxis: {
        categories: categories,
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
        headerFormat: "<b>{point.key}</b><br/>",
        pointFormat: "Toplam Oturum: <b>{point.y}</b>",
      },
      plotOptions: { column: { borderWidth: 0, borderRadius: 2, colorByPoint: true } },
      series: [{ name: "Oturumlar", data: seriesData, showInLegend: false }],
      credits: { enabled: false },
    };
  }, [THEME, dashboardData]);

  const scatterOptions = useMemo(() => {
    if (!dashboardData || !dashboardData.scatterVerisi) return {};

    const series = [0, 1, 2].map((id) => {
      const clusterInfo = dashboardData.clusterOzetleri.find((c) => c.clusterId === id);
      const name = clusterInfo ? clusterInfo.clusterEtiket : `Cluster ${id}`;

      const data = dashboardData.scatterVerisi
        .filter((d) => d.clusterId === id)
        .map((d) => ({
          x: d.totalLogins,
          y: d.uniqueIps,
          name: d.email,
        }));

      return {
        name: name,
        color: getClusterColor(id, THEME),
        data: data,
        marker: { symbol: "circle" },
      };
    });

    return {
      chart: { type: "scatter", backgroundColor: "transparent", height: 400 },
      title: { text: "" },
      xAxis: {
        title: { text: "Toplam Oturum Sayısı", style: { color: THEME.textGray } },
        gridLineColor: THEME.gridLine,
        labels: { style: { color: THEME.textGray } },
      },
      yAxis: {
        title: { text: "Benzersiz IP Sayısı", style: { color: THEME.textGray } },
        gridLineColor: THEME.gridLine,
        labels: { style: { color: THEME.textGray } },
      },
      tooltip: {
        backgroundColor: THEME.cardBg,
        style: { color: THEME.textPrimary },
        borderColor: THEME.gridLine,
        headerFormat: "<b>{series.name}</b><br>",
        pointFormat: "Kullanıcı: {point.name}<br/>Oturum: <b>{point.x}</b>, IP: <b>{point.y}</b>",
      },
      legend: { itemStyle: { color: THEME.textGray, fontWeight: "normal" } },
      series: series,
      credits: { enabled: false },
    };
  }, [THEME, dashboardData]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress color="info" />
      </Box>
    );

  if (!dashboardData) return null;

  return (
    <Box p={3} sx={{ backgroundColor: THEME.mainBg, borderRadius: "1rem" }}>
      <Box mb={3}>
        <Text variant="h5" color={darkMode ? "white" : "dark"} fontWeight="bold">
          Kullanıcı Segmentasyon ve Davranış Analizi
        </Text>
        <Text variant="button" color="text" fontWeight="regular" display="block">
          Sistem kullanıcılarının oturum sıklığı ve ağ erişim çeşitliliğine göre makine öğrenmesi
          algoritmalarıyla gruplandırıldığı davranışsal kümeleme raporu.
        </Text>
      </Box>

      <Grid container spacing={2} mb={3}>
        {dashboardData.clusterOzetleri.map((cluster) => (
          <Grid item xs={12} md={4} key={cluster.clusterId}>
            <SegmentStatCard
              title={cluster.clusterEtiket}
              count={cluster.kullaniciSayisi}
              description={cluster.aciklama}
              borderColor={getClusterColor(cluster.clusterId, THEME)}
              theme={THEME}
              isDark={darkMode}
            />
          </Grid>
        ))}
      </Grid>

      <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none", mb: 3 }}>
        <Box p={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Text variant="h6" color={darkMode ? "white" : "dark"}>
                Kullanıcı Dağılım Profili
              </Text>
              <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                Belirlenen segmentlerin toplam kullanıcı tabanı içerisindeki oransal ağırlığı.
              </Text>
              <HighchartsReact
                key={`donut-${darkMode}`}
                highcharts={Highcharts}
                options={donutOptions}
                immutable={true}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Text variant="h6" color={darkMode ? "white" : "dark"}>
                Segment Bazlı Toplam Oturum Hacmi
              </Text>
              <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
                Farklı kullanıcı kümelerinin sisteme getirdiği kümülatif trafik yükü.
              </Text>
              <HighchartsReact
                key={`col-${darkMode}`}
                highcharts={Highcharts}
                options={columnOptions}
                immutable={true}
              />
            </Grid>
          </Grid>
        </Box>
      </Card>

      <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none", mb: 3 }}>
        <Box p={3}>
          <Text variant="h6" color={darkMode ? "white" : "dark"}>
            Erişim ve Davranış Korelasyonu
          </Text>
          <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
            Kullanıcıların oturum sayıları ile benzersiz IP kullanımı arasındaki ilişki;
            segmentlerin ayrıştığı davranışsal dağılım noktalarını temsil eder.
          </Text>
          <HighchartsReact
            key={`scatter-${darkMode}`}
            highcharts={Highcharts}
            options={scatterOptions}
            immutable={true}
          />
        </Box>
      </Card>

      <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none" }}>
        <Box p={3}>
          <Text variant="h6" color={darkMode ? "white" : "dark"}>
            Kullanıcı Segmentasyon Listesi
          </Text>
          <Text variant="button" color="text" fontWeight="regular" mb={3} display="block">
            Sistem kullanıcılarının dahil oldukları kümeler ve temel etkileşim metriklerinin detaylı
            dökümü.
          </Text>

          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${THEME.border}` }}>
                  <th style={{ textAlign: "left", padding: "12px", color: THEME.textGray }}>
                    E-Posta Adresi
                  </th>
                  <th style={{ textAlign: "center", padding: "12px", color: THEME.textGray }}>
                    Benzersiz IP
                  </th>
                  <th style={{ textAlign: "center", padding: "12px", color: THEME.textGray }}>
                    Toplam Oturum
                  </th>
                  <th style={{ textAlign: "right", padding: "12px", color: THEME.textGray }}>
                    Küme Ataması
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, i) => (
                  <tr
                    key={user.id || `${user.email}-${i}`}
                    style={{ borderBottom: `1px solid ${THEME.border}` }}
                  >
                    <td style={{ padding: "12px" }}>
                      <Text
                        variant="button"
                        color={darkMode ? "white" : "dark"}
                        fontWeight="medium"
                      >
                        {user.email}
                      </Text>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <Text variant="button" sx={{ color: THEME.textSecondary }}>
                        {user.uniqueIps}
                      </Text>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <Text variant="button" sx={{ color: THEME.textSecondary }}>
                        {user.totalLogins}
                      </Text>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <Badge
                        variant="gradient"
                        badgeContent={`Segment ${user.clusterId}`}
                        color={
                          user.clusterId === 2
                            ? "error"
                            : user.clusterId === 1
                              ? "info"
                              : "secondary"
                        }
                        size="xs"
                        container
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3} pt={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": { color: THEME.textPrimary },
                  "& .Mui-selected": {
                    backgroundColor: THEME.cluster1 + " !important",
                    color: "#fff !important",
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
}

export default UserSegments;
