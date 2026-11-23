import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "api/client";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

import Box from "ui/Box";
import Page from "ui/Page";
import PageHero from "ui/PageHero";
import Text from "ui/Text";

import CounterCard from "ui/CounterCard";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

function Row({ item, last, basePath }) {
  const navigate = useNavigate();

  return (
    <>
      <Box display="flex" justifyContent="space-between" py={0.5}>
        <Box>
          <Text
            variant="button"
            fontWeight="medium"
            sx={{
              cursor: "pointer",
              transition: "color 0.2s",
              "&:hover": { color: (theme) => theme.palette.info.main },
            }}
            onClick={() => navigate(`${basePath}/${item.id}`)}
          >
            {item.name}
          </Text>
          <Text variant="caption" color="secondary" display="block">
            {item.detail}
          </Text>
        </Box>
        <Text variant="caption">{item.time}</Text>
      </Box>
      {!last && <Divider sx={{ my: 0.5 }} />}
    </>
  );
}

function ActivityCard({ title, icon, color, data, basePath }) {
  const [page, setPage] = useState(0);
  const perPage = 4;
  const total = Math.ceil((data?.length || 0) / perPage);
  const slice = data ? data.slice(page * perPage, (page + 1) * perPage) : [];

  useEffect(() => {
    setPage(0);
  }, [data]);

  return (
    <Card sx={{ height: "100%" }}>
      <Box p={1.5}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center">
            <Box
              width="2rem"
              height="2rem"
              borderRadius="md"
              bgColor={color}
              display="flex"
              justifyContent="center"
              alignItems="center"
              mr={1}
            >
              <Icon sx={{ color: "#fff", fontSize: "1rem" }}>{icon}</Icon>
            </Box>
            <Text variant="button" fontWeight="bold">
              {title}
            </Text>
          </Box>

          {total > 1 && (
            <Box display="flex" alignItems="center">
              <Icon
                onClick={() => setPage(Math.max(0, page - 1))}
                sx={{ cursor: "pointer", fontSize: "1.2rem" }}
              >
                chevron_left
              </Icon>
              <Text variant="caption">
                {page + 1} / {total}
              </Text>
              <Icon
                onClick={() => setPage(Math.min(total - 1, page + 1))}
                sx={{ cursor: "pointer", fontSize: "1.2rem" }}
              >
                chevron_right
              </Icon>
            </Box>
          )}
        </Box>
        <Divider sx={{ my: 1 }} />

        {slice.length > 0 ? (
          slice.map((item, i) => (
            <Row key={item.id} item={item} last={i === slice.length - 1} basePath={basePath} />
          ))
        ) : (
          <Box py={2} textAlign="center">
            <Text variant="caption" color="secondary">
              Kayıt bulunamadı.
            </Text>
          </Box>
        )}
      </Box>
    </Card>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);

  const [downServices, setDownServices] = useState([]);

  const [stats, setStats] = useState({
    personelAktif: 0,
    personelAkademik: 0,
    personelIdari: 0,
    personelDiger: 0,
    personelEmekli: 0,
    personelIstifa: 0,
    ogrenciKayitli: 0,
    ogrenciKayitsiz: 0,
    ogrenciYurt: 0,
    ogrenciDisiplin: 0,
  });

  const [recentActivities, setRecentActivities] = useState({
    edit: [],
    add: [],
    leave: [],
  });

  const [studentActivities, setStudentActivities] = useState({
    edit: [],
    add: [],
    leave: [],
  });

  const reportServiceDown = (serviceName) => {
    setDownServices((prev) => {
      if (!prev.includes(serviceName)) {
        return [...prev, serviceName];
      }
      return prev;
    });
  };

  useEffect(() => {
    const fetchStat = async (endpoint, params, serviceName) => {
      try {
        const res = await api.get(endpoint, { params });
        const data = res.data || res;
        if (data && typeof data.totalElements !== "undefined") return data.totalElements;
        return 0;
      } catch (error) {
        console.error(`İstek başarısız oldu (${endpoint}):`, error.message);
        reportServiceDown(serviceName);
        return 0;
      }
    };

    const fetchActivities = async () => {
      let persData = {};
      let stuData = {};

      try {
        const persRes = await api.get("/api/v1/personel/stats");
        persData = persRes.data?.data || persRes.data || {};
      } catch (error) {
        console.error("Personel son hareketler çekilemedi:", error);
        reportServiceDown("Personel Servisi");
      }

      try {
        const stuRes = await api.get("/api/v1/students/stats");
        stuData = stuRes.data?.data || stuRes.data || {};
      } catch (error) {
        console.error("Öğrenci son hareketler çekilemedi:", error);
        reportServiceDown("Öğrenci Servisi");
      }

      const mapPersonelData = (list, dateField) => {
        if (!Array.isArray(list)) return [];
        return list.map((item) => ({
          id: item.id,
          name: `${item.ad || ""} ${item.soyad || ""}`.trim() || "İsimsiz",
          detail: item.kurumEmail || "-",
          time: formatDate(item[dateField]),
        }));
      };

      const mapStudentData = (list, dateField) => {
        if (!Array.isArray(list)) return [];
        return list.map((item) => ({
          id: item.id,
          name: `${item.ad || ""} ${item.soyad || ""}`.trim() || "İsimsiz",
          detail: item.studentNumber || "-",
          time: formatDate(item[dateField]),
        }));
      };

      setRecentActivities({
        edit: mapPersonelData(persData.sonGuncellenen, "updatedAt"),
        add: mapPersonelData(persData.sonEklenen, "createdAt"),
        leave: mapPersonelData(persData.sonAyrilan || [], "updatedAt"),
      });

      setStudentActivities({
        edit: mapStudentData(stuData.sonGuncellenen, "updatedAt"),
        add: mapStudentData(stuData.sonEklenen, "createdAt"),
        leave: mapStudentData(stuData.sonAyrilan || [], "updatedAt"),
      });
    };

    const fetchAllData = async () => {
      setLoading(true);
      setDownServices([]);

      await Promise.all([
        fetchActivities(),
        Promise.all([
          fetchStat("/api/v1/personel/aktif", { page: 0, size: 10 }, "Personel Servisi"),
          fetchStat(
            "/api/v1/personel/list",
            { page: 0, size: 10, jobrecordTipi: "AKADEMIK", isActive: true },
            "Personel Servisi"
          ),
          fetchStat(
            "/api/v1/personel/list",
            { page: 0, size: 10, jobrecordTipi: "IDARI", isActive: true },
            "Personel Servisi"
          ),
          fetchStat(
            "/api/v1/personel/list",
            { page: 0, size: 10, jobrecordTipi: "AKADEMIK", emekliMi: true, isActive: false },
            "Personel Servisi"
          ),
          fetchStat(
            "/api/v1/personel/list",
            { page: 0, size: 10, jobrecordTipi: "DIGER_PERSONEL", isActive: true },
            "Personel Servisi"
          ),
          fetchStat(
            "/api/v1/personel/list",
            { page: 0, size: 10, ayrilmaTipi: "ISTIFA", isActive: false },
            "Personel Servisi"
          ),

          fetchStat(
            "/api/v1/students/list",
            { page: 0, size: 10, kayitlilik: "KAYITLI" },
            "Öğrenci Servisi"
          ),
          fetchStat(
            "/api/v1/students/list",
            { page: 0, size: 10, kayitlilik: "KAYITSIZ" },
            "Öğrenci Servisi"
          ),
          fetchStat(
            "/api/v1/students/list",
            { page: 0, size: 10, yurtMu: true },
            "Öğrenci Servisi"
          ),
          fetchStat(
            "/api/v1/students/list",
            { page: 0, size: 10, disiplinCezasiVar: true },
            "Öğrenci Servisi"
          ),
        ]).then(
          ([
            personelAktif,
            personelAkademik,
            personelIdari,
            personelEmekli,
            personelDiger,
            personelIstifa,
            ogrenciKayitli,
            ogrenciKayitsiz,
            ogrenciYurt,
            ogrenciDisiplin,
          ]) => {
            setStats({
              personelAktif,
              personelAkademik,
              personelIdari,
              personelEmekli,
              personelDiger,
              personelIstifa,
              ogrenciKayitli,
              ogrenciKayitsiz,
              ogrenciYurt,
              ogrenciDisiplin,
            });
          }
        ),
      ]);

      setLoading(false);
    };

    fetchAllData();
  }, []);

  const activeData = tab === 0 ? recentActivities : studentActivities;
  const currentBasePath = tab === 0 ? "/records/user-details" : "/records/student-details";

  const hasError = downServices.length > 0;
  const statusText = loading
    ? "Kontrol ediliyor..."
    : hasError
      ? "Kısmi Kesinti"
      : "Sistem Sağlıklı";
  const statusColor = loading ? "secondary" : hasError ? "warning" : "success";
  const statusTooltip = hasError
    ? `${downServices.join(", ")} bağlantısında sorun yaşanıyor.`
    : "Tüm servisler sorunsuz çalışıyor.";

  return (
    <Page>
      <PageHero
        tone="records"
        title="Kayıtlar"
        description="Personel ve öğrenci kayıtlarının özeti, son eklenenler ve son güncellenenler."
        stats={[
          ["Aktif personel", stats.personelAktif, "badge"],
          ["Kayıtlı öğrenci", stats.ogrenciKayitli, "school"],
        ]}
      />
      <Box pt={1} pb={0}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Tooltip title={statusTooltip} placement="left">
            <Box
              className="dark-status-pill"
              display="flex"
              alignItems="center"
              px={1.5}
              py={0.5}
              borderRadius="lg"
              bgColor="white"
              shadow="sm"
              sx={{ cursor: "pointer" }}
            >
              <Box
                width="8px"
                height="8px"
                borderRadius="50%"
                bgColor={statusColor}
                mr={1}
                sx={{
                  boxShadow: (theme) => `0 0 4px ${theme.palette[statusColor].main}`,
                  animation: hasError ? "pulse 2s infinite" : "none",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
              <Text variant="caption" fontWeight="bold" color="text">
                {statusText}
              </Text>
            </Box>
          </Tooltip>
        </Box>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} lg={7}>
            <Card sx={{ height: "100%", p: 2 }}>
              <Box mb={1.5} display="flex" alignItems="center">
                <Box
                  width="2rem"
                  height="2rem"
                  borderRadius="md"
                  bgColor="info"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mr={1.5}
                  variant="gradient"
                >
                  <Icon sx={{ color: "#fff", fontSize: "1.2rem" }}>groups</Icon>
                </Box>
                <Text variant="h6" fontWeight="bold">
                  Personel İstatistikleri
                </Text>
              </Box>

              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6} md={4}>
                  <CounterCard
                    count={stats.personelAktif}
                    title="Aktif"
                    description="Tüm çalışanlar"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <CounterCard
                    count={stats.personelAkademik}
                    title="Akademik"
                    description="Akademisyenler"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <CounterCard
                    count={stats.personelIdari}
                    title="İdari"
                    description="İdari kadro"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <CounterCard
                    count={stats.personelDiger}
                    title="Diğer"
                    description="Diğer tipler"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <CounterCard
                    count={stats.personelEmekli}
                    title="Emekli"
                    description="Emekliler"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <CounterCard
                    count={stats.personelIstifa}
                    title="İstifa Edenler"
                    description="Ayrılanlar"
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Card sx={{ height: "100%", p: 2 }}>
              <Box mb={1.5} display="flex" alignItems="center">
                <Box
                  width="2rem"
                  height="2rem"
                  borderRadius="md"
                  bgColor="success"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mr={1.5}
                  variant="gradient"
                >
                  <Icon sx={{ color: "#fff", fontSize: "1.2rem" }}>school</Icon>
                </Box>
                <Text variant="h6" fontWeight="bold">
                  Öğrenci İstatistikleri
                </Text>
              </Box>

              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <CounterCard
                    count={stats.ogrenciKayitli}
                    title="Kayıtlı"
                    description="Aktif öğrenciler"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CounterCard
                    count={stats.ogrenciKayitsiz}
                    title="Kayıtsız"
                    description="Kayıt yenilemeyenler"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CounterCard
                    count={stats.ogrenciYurt}
                    title="Yurtta Kalan"
                    description="Barınma hizmeti alanlar"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CounterCard
                    count={stats.ogrenciDisiplin}
                    title="Disiplin Cezası"
                    description="Ceza alanlar"
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          mb={1.5}
        >
          <Text variant="h6" fontWeight="bold">
            Son Hareketler
          </Text>

          <Box
            className="dark-mini-tabs-container"
            display="flex"
            bgColor="light"
            borderRadius="xl"
            p={0.5}
            mt={{ xs: 1, sm: 0 }}
          >
            <Box
              className={`dark-mini-tab ${tab === 0 ? "active" : ""}`}
              display="flex"
              alignItems="center"
              px={2}
              py={0.5}
              borderRadius="lg"
              bgColor={tab === 0 ? "white" : "transparent"}
              shadow={tab === 0 ? "sm" : "none"}
              onClick={() => setTab(0)}
              sx={{ cursor: "pointer" }}
            >
              <Icon fontSize="small">groups</Icon>
              <Text variant="button" ml={0.5}>
                Personel
              </Text>
            </Box>
            <Box
              className={`dark-mini-tab ${tab === 1 ? "active" : ""}`}
              display="flex"
              alignItems="center"
              px={2}
              py={0.5}
              borderRadius="lg"
              bgColor={tab === 1 ? "white" : "transparent"}
              shadow={tab === 1 ? "sm" : "none"}
              onClick={() => setTab(1)}
              sx={{ cursor: "pointer" }}
            >
              <Icon fontSize="small">school</Icon>
              <Text variant="button" ml={0.5}>
                Öğrenci
              </Text>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <ActivityCard
              title="Düzenlenenler"
              icon="edit"
              color="info"
              data={activeData.edit}
              basePath={currentBasePath}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ActivityCard
              title="Eklenenler"
              icon="person_add"
              color="success"
              data={activeData.add}
              basePath={currentBasePath}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ActivityCard
              title="Ayrılanlar"
              icon="logout"
              color="error"
              data={activeData.leave}
              basePath={currentBasePath}
            />
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
}
