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

import { getClientTransitionsDashboard } from "../api/clientTransitionsService";

const networkgraph = require("highcharts/modules/networkgraph");
if (typeof networkgraph === "function") {
  networkgraph(Highcharts);
} else if (networkgraph && typeof networkgraph.default === "function") {
  networkgraph.default(Highcharts);
}

const getTheme = chartTheme;

const getLevelBadgeColor = (seviye) => {
  if (!seviye) return "secondary";
  const s = seviye.toLowerCase();
  if (s.includes("yüksek")) return "success";
  if (s.includes("orta")) return "warning";
  return "secondary";
};

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

function ClientTransitions() {
  const [controller] = useUiController();
  const { darkMode } = controller;
  const THEME = useMemo(() => getTheme(darkMode), [darkMode]);

  const [transitionData, setTransitionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getClientTransitionsDashboard();
        setTransitionData(res);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const graphOptions = useMemo(() => {
    let edgesData = [];
    let nodesData = [];

    if (transitionData?.edges && transitionData?.nodes) {
      edgesData = transitionData.edges.map((edge) => ({
        from: edge.kaynak,
        to: edge.hedef,
      }));

      nodesData = transitionData.nodes.map((node, index) => {
        const isMainNode = node.id === transitionData.enYuksekGuvenKaynak;
        return {
          id: node.id,
          color: THEME.colors[index % THEME.colors.length],
          marker: { radius: isMainNode ? 40 : 30 },
        };
      });
    }

    return {
      chart: { type: "networkgraph", backgroundColor: "transparent", height: 400 },
      title: { text: "" },
      plotOptions: {
        networkgraph: {
          keys: ["from", "to"],
          layoutAlgorithm: { enableSimulation: false, friction: -0.9 },
        },
      },
      series: [
        {
          dataLabels: {
            enabled: true,
            linkFormat: "",
            style: { fontSize: "12px", color: THEME.textPrimary, textOutline: "none" },
          },
          id: "client-network",
          data: edgesData,
          nodes: nodesData,
        },
      ],
      credits: { enabled: false },
    };
  }, [THEME, transitionData]);

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
          Uygulama Geçiş ve Bağımlılık Analizi
        </Text>
        <Text variant="button" color="text" fontWeight="regular" display="block">
          Kullanıcıların entegre uygulamalar arasındaki hareket örüntülerini ve uygulama
          birlikteliklerinin istatistiksel olasılıklarını içeren korelasyon analizi.
        </Text>
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Toplam Etkileşim Kuralı"
            value={transitionData?.toplamGecisKurali?.toString() || "0"}
            theme={THEME}
            isDark={darkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="En Yüksek Korelasyon"
            value={
              transitionData?.enYuksekGuvenKaynak && transitionData?.enYuksekGuvenHedef
                ? `${transitionData.enYuksekGuvenKaynak} ➔ ${transitionData.enYuksekGuvenHedef}`
                : "-"
            }
            subtitle={
              transitionData?.enYuksekGuvenOrani
                ? `Korelasyon Skoru: %${(transitionData.enYuksekGuvenOrani * 100).toFixed(1)}`
                : ""
            }
            theme={THEME}
            isDark={darkMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Benzersiz Entegre Uygulama"
            value={transitionData?.benzersizClient?.toString() || "0"}
            theme={THEME}
            isDark={darkMode}
          />
        </Grid>
      </Grid>

      <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none", mb: 3 }}>
        <Box p={3}>
          <Text variant="h6" color={darkMode ? "white" : "dark"}>
            Uygulama Etkileşim Ağı (Topoloji)
          </Text>
          <Text variant="button" color="text" fontWeight="regular" mb={2} display="block">
            Uygulamalar arasındaki organik geçiş yollarını ve servisler arası bağımlılık yoğunluğunu
            gösteren ilişkisel grafik.
          </Text>
          <HighchartsReact
            key={`network-${darkMode}`}
            highcharts={Highcharts}
            options={graphOptions}
            immutable={true}
          />
        </Box>
      </Card>

      <Card sx={{ backgroundColor: THEME.cardBg, boxShadow: "none" }}>
        <Box p={3}>
          <Text variant="h6" color={darkMode ? "white" : "dark"}>
            Geçiş ve Bağımlılık Detayları
          </Text>
          <Text variant="button" color="text" fontWeight="regular" mb={3} display="block">
            Kaynak ve hedef uygulamalar arasındaki geçişlerin istatistiksel güven oranları ve
            kritiklik seviyeleri.
          </Text>
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${THEME.border}` }}>
                  <th style={{ textAlign: "left", padding: "12px", color: THEME.textGray }}>
                    Kaynak Uygulama
                  </th>
                  <th style={{ textAlign: "left", padding: "12px", color: THEME.textGray }}>
                    Hedef Uygulama
                  </th>
                  <th style={{ textAlign: "right", padding: "12px", color: THEME.textGray }}>
                    Korelasyon Skoru
                  </th>
                  <th style={{ textAlign: "center", padding: "12px", color: THEME.textGray }}>
                    Kritiklik Seviyesi
                  </th>
                </tr>
              </thead>
              <tbody>
                {transitionData?.tumGecisler?.map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom:
                        index !== transitionData.tumGecisler.length - 1
                          ? `1px solid ${THEME.border}`
                          : "none",
                    }}
                  >
                    <td style={{ padding: "12px" }}>
                      <Text
                        variant="button"
                        color={darkMode ? "white" : "dark"}
                        fontWeight="medium"
                      >
                        {row.kaynak}
                      </Text>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <Text variant="button" color={darkMode ? "white" : "dark"}>
                        {row.hedef}
                      </Text>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <Text variant="button" color={darkMode ? "white" : "dark"} fontWeight="bold">
                        {`${(row.guvenOrani * 100).toFixed(1)}%`}
                      </Text>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <Badge
                        variant="gradient"
                        badgeContent={row.seviye}
                        color={getLevelBadgeColor(row.seviye)}
                        size="xs"
                        container
                      />
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

export default ClientTransitions;
