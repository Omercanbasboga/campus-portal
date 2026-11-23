import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import api from "api/client";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Box from "ui/Box";
import Page from "ui/Page";
import Text from "ui/Text";
import Avatar from "ui/Avatar";

import PersonalInfoTab from "./tabs/PersonalInfoTab";
import AcademicInfoTab from "./tabs/AcademicInfoTab";
import ClubsInfoTab from "./tabs/ClubsInfoTab";

const DetailItem = ({
  icon,
  label,
  value,
  iconColor = "secondary",
  labelColor = "secondary",
  valueColor = "text",
}) => (
  <Box display="flex" alignItems="center" mb={1.5}>
    <Icon fontSize="medium" color={iconColor} sx={{ mr: 1 }}>
      {icon}
    </Icon>
    <Text variant="body1" fontWeight="bold" color={labelColor} sx={{ mr: 0.5 }}>
      {label}:
    </Text>
    <Text
      variant="body1"
      color={valueColor}
      fontWeight={valueColor === "error" ? "bold" : "regular"}
    >
      {value || "-"}
    </Text>
  </Box>
);

DetailItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  iconColor: PropTypes.string,
  labelColor: PropTypes.string,
  valueColor: PropTypes.string,
};

const formatDateTR = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("tr-TR");
};

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [taskMenuOpen, setTaskMenuOpen] = useState(false);
  const [taskTabValue, setTaskTabValue] = useState(0);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/v1/students/${id}`);
      const rawData = response.data?.data || response.data?.content || response.data;

      const safeStudentData = {
        id: rawData?.id,
        ad: rawData?.ad,
        soyad: rawData?.soyad,
        studentNumber: rawData?.studentNumber,
        photo: rawData?.photo,
        email: rawData?.email,
        okulEmail: rawData?.okulEmail,
        ceptel: rawData?.ceptel,
        telefon: rawData?.telefon,
        uyruk: rawData?.uyruk,
        cinsiyet:
          rawData?.cinsiyet === "K"
            ? "Kadın"
            : rawData?.cinsiyet === "E"
              ? "Erkek"
              : rawData?.cinsiyet,
        tckimlik: rawData?.tckimlik,
        pasaportNo: rawData?.pasaportNo,
        adres1: rawData?.adres1,
        adres2: rawData?.adres2,
        il: rawData?.il,
        ilce: rawData?.ilce,
        il2: rawData?.il2,
        ilce2: rawData?.ilce2,

        bolumTip: rawData?.bolumTip,
        statu: rawData?.statu,
        girisTipi: rawData?.girisTipi,
        universiteGiris: rawData?.universiteGiris,
        bolumEgiris: rawData?.bolumEgiris,
        donemDurumu: rawData?.donemDurumu,
        durumu: rawData?.durumu,
        kayitlilik: rawData?.kayitlilik,
        toplamDonem: rawData?.toplamDonem,
        kayitTarihi: rawData?.kayitTarihi,
        gpa: rawData?.gpa,
        sertifika: rawData?.sertifika,
        yerlesilePuanTuru: rawData?.yerlesilePuanTuru,
        yerKullanilanPuani: rawData?.yerKullanilanPuani,
        yerKullanilanBasariSirasi: rawData?.yerKullanilanBasariSirasi,
        tercihSirasi: rawData?.tercihSirasi,
        disiplinCezasiVar: rawData?.disiplinCezasiVar,

        kulupler: rawData?.kulupler || rawData?.clubs || [],
        idariGorevler: rawData?.idariGorevler || [],
        fiiliGorevler: rawData?.fiiliGorevler || [],

        bolum: {
          id: rawData?.bolum?.id,
          name: rawData?.bolum?.name || "-",
        },
        fakulte: {
          name: rawData?.fakulte?.name || rawData?.bolum?.ustBirim?.name || "-",
        },
      };

      setStudent(safeStudentData);
    } catch (e) {
      console.error("Öğrenci bilgisi alınamadı:", e);
      setError("Öğrenci bilgisi alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  const handleSetTabValue = (newValue) => {
    if (newValue === 2) {
      if (!taskMenuOpen) {
        setTaskMenuOpen(true);
        setTabValue(2);
        setTaskTabValue(0);
      } else {
        setTabValue(2);
        setTaskTabValue((prev) => (prev === 0 ? 1 : 0));
      }
      return;
    }
    setTabValue(newValue);
    setTaskMenuOpen(false);
  };

  return (
    <Page>
      <Box position="relative" mb={5} mt={2}>
        <Card
          sx={{
            boxShadow: "none",
            pt: 0,
            pb: 3,
            overflow: "hidden",
            px: 3,
          }}
        >
          <Box
            aria-hidden
            sx={(t) => ({
              mx: -3,
              mb: -7,
              height: 120,
              backgroundImage: `radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), ${
                t.palette.mode === "dark"
                  ? "linear-gradient(120deg, #2A1F45, #1C2C44 55%, #10343A)"
                  : "linear-gradient(120deg, #6B4E9B, #4F6BED 55%, #0E9AA7)"
              }`,
              backgroundSize: "16px 16px, auto",
            })}
          />
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item>
              <Avatar
                src={student?.photo || ""}
                alt={student ? `${student.ad || ""} ${student.soyad || ""}` : "profil-fotografi"}
                variant="rounded"
                sx={{
                  width: 128,
                  height: 128,
                  fontSize: "2.6rem",
                  border: "4px solid",
                  borderColor: "background.paper",
                  boxShadow: "0 10px 30px -12px rgba(15, 23, 27, 0.45)",
                  "& img, & .MuiAvatar-img": {
                    objectFit: "contain !important",
                  },
                }}
              >
                {!student?.photo && (
                  <Icon sx={{ fontSize: "110px !important", color: "#ced4da" }}>person</Icon>
                )}
              </Avatar>
            </Grid>

            <Grid item>
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center" flexWrap="wrap">
                  <Text variant="h5" fontWeight="bold" sx={{ mr: 1.5 }}>
                    {loading
                      ? "Yükleniyor..."
                      : student
                        ? `${student.ad || ""} ${student.soyad || ""}`
                        : "Öğrenci Bulunamadı"}
                  </Text>

                  <Box
                    display="flex"
                    alignItems="center"
                    pl={1.5}
                    sx={{
                      borderLeft: "2px solid",
                      borderColor: "divider",
                      cursor: student?.bolum?.id ? "pointer" : "default",
                      "&:hover": student?.bolum?.id ? { opacity: 0.8 } : {},
                    }}
                    onClick={() => {
                      if (student?.bolum?.id) {
                        navigate(`/records/department-details/${student.bolum.id}`);
                      }
                    }}
                  >
                    <Text variant="subtitle1" color="text" fontWeight="medium">
                      {student?.bolum?.name || "-"}
                    </Text>
                  </Box>
                </Box>

                <Box mt={0.5}>
                  <Text variant="body2" color="text" fontWeight="medium">
                    {student?.studentNumber ? `Öğrenci No: ${student.studentNumber}` : "-"}
                  </Text>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md="auto" sx={{ ml: "auto" }}>
              <Box display="flex" alignItems="center" gap={4} flexWrap="wrap">
                <Box display="flex" alignItems="center">
                  <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                    email
                  </Icon>
                  <Text variant="body2" fontWeight="medium" color="text">
                    {student?.okulEmail || "-"}
                  </Text>
                </Box>
                <Box display="flex" alignItems="center">
                  <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                    phone
                  </Icon>
                  <Text variant="body2" fontWeight="medium" color="text">
                    {student?.ceptel || "-"}
                  </Text>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>

      <Box mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} xl={3}>
            <Card sx={{ pt: 2, pb: 2 }}>
              <List
                component="nav"
                sx={{ px: 2, display: "flex", flexDirection: "column", gap: 0.5 }}
              >
                <ListItemButton
                  selected={tabValue === 0}
                  onClick={() => handleSetTabValue(0)}
                  sx={{
                    borderRadius: "md",
                    py: 1.5,
                    "&.Mui-selected": { backgroundColor: "transparent !important" },
                    "&.Mui-selected:hover": { backgroundColor: "rgba(0, 0, 0, 0.04) !important" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon color={tabValue === 0 ? "info" : "inherit"}>person</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Text
                        variant="subtitle2"
                        fontWeight="bold"
                        color={tabValue === 0 ? "info" : "text"}
                      >
                        Kişisel Bilgiler
                      </Text>
                    }
                  />
                </ListItemButton>

                <ListItemButton
                  selected={tabValue === 1}
                  onClick={() => handleSetTabValue(1)}
                  sx={{
                    borderRadius: "md",
                    py: 1.5,
                    "&.Mui-selected": { backgroundColor: "transparent !important" },
                    "&.Mui-selected:hover": { backgroundColor: "rgba(0, 0, 0, 0.04) !important" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon color={tabValue === 1 ? "info" : "inherit"}>school</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Text
                        variant="subtitle2"
                        fontWeight="bold"
                        color={tabValue === 1 ? "info" : "text"}
                      >
                        Akademik Bilgiler
                      </Text>
                    }
                  />
                </ListItemButton>

                <ListItemButton
                  selected={tabValue === 2}
                  onClick={() => handleSetTabValue(2)}
                  sx={{
                    borderRadius: "md",
                    py: 1.5,
                    "&.Mui-selected": { backgroundColor: "transparent !important" },
                    "&.Mui-selected:hover": { backgroundColor: "rgba(0, 0, 0, 0.04) !important" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon color={tabValue === 2 ? "info" : "inherit"}>groups</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Text
                        variant="subtitle2"
                        fontWeight="bold"
                        color={tabValue === 2 ? "info" : "text"}
                      >
                        Bağlı Olduğu Kulüpler
                      </Text>
                    }
                  />
                </ListItemButton>
              </List>
            </Card>
          </Grid>

          <Grid item xs={12} md={8} xl={9}>
            {tabValue === 0 && <PersonalInfoTab student={student} DetailItem={DetailItem} />}

            {tabValue === 1 && <AcademicInfoTab student={student} DetailItem={DetailItem} />}

            {tabValue === 2 && <ClubsInfoTab student={student} formatDateTR={formatDateTR} />}
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
}

export default StudentDetails;
