import React from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Box from "ui/Box";
import Text from "ui/Text";
import Badge from "ui/Badge";

export default function AcademicInfoTab({ user, formatDateTR }) {
  return (
    <Card sx={{ height: "100%" }}>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Text variant="h5" fontWeight="medium" color="dark">
            Akademisyen Bilgileri
          </Text>
        </Box>
        <Box mt={3}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box mb={4}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                    person
                  </Icon>
                  <Text variant="h6" color="dark" fontWeight="bold">
                    Temel Bilgiler
                  </Text>
                </Box>
                <Box display="flex" flexDirection="column" gap={0}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Text variant="body2" fontWeight="bold" color="text">
                      Ana Bilim Dalı:
                    </Text>
                    <Text variant="body2" fontWeight="medium" color="dark">
                      {user?.abd?.ad || "—"}
                    </Text>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Text variant="body2" fontWeight="bold" color="text">
                      ORCID:
                    </Text>
                    <Text variant="body2" fontWeight="medium" color="dark">
                      {user?.orcid || "—"}
                    </Text>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Text variant="body2" fontWeight="bold" color="text">
                      Scopus No:
                    </Text>
                    <Text variant="body2" fontWeight="medium" color="dark">
                      {user?.scopusNo || "—"}
                    </Text>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Text variant="body2" fontWeight="bold" color="text">
                      YÖKSİS No:
                    </Text>
                    <Text variant="body2" fontWeight="medium" color="dark">
                      {user?.yoksisArastirmaciNo || "—"}
                    </Text>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Text variant="body2" fontWeight="bold" color="text">
                      Doktora Durumu:
                    </Text>
                    <Badge
                      variant="gradient"
                      color={user?.isDoktorali ? "success" : "secondary"}
                      size="md"
                      badgeContent={user?.isDoktorali ? "Doktoralı" : "Doktoralı Değil"}
                      container
                    />
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                    event
                  </Icon>
                  <Text variant="h6" color="dark" fontWeight="bold">
                    Atanma Tarihleri
                  </Text>
                </Box>
                <Box display="flex" flexDirection="column" gap={0}>
                  {[
                    { label: "Doktora Tarihi", value: user?.doktoraTarihi },
                    { label: "Yrd. Doçentlik Tarihi", value: user?.yrddocTarihi },
                    { label: "Yrd. Doç. Atanma", value: user?.yrddocAtanmaTarihi },
                    { label: "Doçentlik Tarihi", value: user?.docentTarihi },
                    { label: "Doçentlik Atanma", value: user?.docentAtanmaTarihi },
                    { label: "Profesörlük Tarihi", value: user?.profesorTarihi },
                    { label: "Profesörlük Atanma", value: user?.profesorAtanmaTarihi },
                  ].map((item, i) => (
                    <Box
                      key={i}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1}
                    >
                      <Text variant="body2" fontWeight="bold" color="text">
                        {item.label}:
                      </Text>
                      <Text variant="body2" fontWeight="medium" color="dark">
                        {formatDateTR(item.value) || "—"}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                  military_tech
                </Icon>
                <Text variant="h6" color="dark" fontWeight="bold">
                  Unvan Geçmişi
                </Text>
              </Box>
              <Box display="flex" flexDirection="column" gap={0}>
                {user?.akademikUnvanGecmisi && user.akademikUnvanGecmisi.length > 0 ? (
                  user.akademikUnvanGecmisi.map((unvan, idx) => (
                    <Box key={idx} py={1.5} display="flex" alignItems="flex-start">
                      <Box mt={0.8} mr={1.5}>
                        <Box
                          width="0.6rem"
                          height="0.6rem"
                          borderRadius="50%"
                          bgColor="info"
                          variant="gradient"
                        />
                      </Box>
                      <Box display="flex" flexDirection="column">
                        <Text variant="subtitle2" fontWeight="bold" color="dark">
                          {unvan.unvanAdi}
                        </Text>
                        <Text variant="body2" color="text" fontWeight="medium" mt={0.5}>
                          Başlangıç:{" "}
                          <Text variant="body2" color="dark" fontWeight="bold">
                            {formatDateTR(unvan.baslangicTarihi)}
                          </Text>
                        </Text>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Text variant="body2" color="text" fontWeight="medium">
                    Kayıtlı unvan geçmişi bulunamadı.
                  </Text>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                  school
                </Icon>
                <Text variant="h6" color="dark" fontWeight="bold">
                  Eğitim Bilgileri
                </Text>
              </Box>
              <Box display="flex" flexDirection="column" gap={0}>
                {user?.okullar && user.okullar.length > 0 ? (
                  user.okullar.map((okul, idx) => (
                    <Box
                      key={idx}
                      py={2}
                      sx={{
                        borderBottom: idx !== user.okullar.length - 1 ? "1px solid #eee" : "none",
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={1}
                      >
                        <Box display="flex" flexDirection="column" pr={1}>
                          <Text
                            variant="subtitle2"
                            fontWeight="bold"
                            color="dark"
                            sx={{ lineHeight: 1.2 }}
                          >
                            {okul.okulAd}
                          </Text>
                          <Text variant="body2" color="text" fontWeight="medium" mt={0.5}>
                            {okul.bolum}
                          </Text>
                        </Box>
                        <Badge color="info" size="sm" badgeContent={okul.ogrenimdurumu} container />
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Text variant="body2" color="secondary" fontWeight="bold">
                          Mezuniyet:{" "}
                          <Text variant="body2" color="dark" fontWeight="medium">
                            {formatDateTR(okul.mezuniyetTarihi) || "—"}
                          </Text>
                        </Text>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Text variant="body2" color="text" fontWeight="medium">
                    Kayıtlı eğitim bilgisi bulunamadı.
                  </Text>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Card>
  );
}
