import React from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Box from "ui/Box";
import Text from "ui/Text";
import Badge from "ui/Badge";
import { useNavigate } from "react-router-dom";

export default function DutyInfoTab({ user, orgPath, formatDateTR, userDeptUuid }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: "100%" }}>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Text variant="h5" fontWeight="medium">
            Görev / Kadro Bilgileri
          </Text>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                work_outline
              </Icon>
              <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                Görev Ünvanı:
              </Text>
              <Text variant="body2" color="text">
                {user?.unvan?.ad || "-"}
              </Text>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                category
              </Icon>
              <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                Kadro Türü:
              </Text>
              <Text variant="body2" color="text">
                {user?.jobrecordTipi || "-"}
              </Text>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                playlist_add_check
              </Icon>
              <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                Kadro Alt Türü:
              </Text>
              <Text variant="body2" color="text">
                {user?.jobrecordAlttipi || "-"}
              </Text>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                badge
              </Icon>
              <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                Sicil No:
              </Text>
              <Text variant="body2" color="text">
                {user?.kurumSicilNo || "-"}
              </Text>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                info
              </Icon>
              <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                Kadro Durumu:
              </Text>
              <Text variant="body2" color="text">
                {user?.jobrecordDurum || "-"}
              </Text>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                event_available
              </Icon>
              <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                Göreve Başlama:
              </Text>
              <Text variant="body2" color="text">
                {formatDateTR(user?.univBastar)}
              </Text>
            </Box>
          </Grid>
          {user?.civilServiceEndDate && (
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" mb={1}>
                <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                  event_busy
                </Icon>
                <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                  Görevden Ayrılma:
                </Text>
                <Text variant="body2" color="text">
                  {formatDateTR(user?.civilServiceEndDate)}
                </Text>
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Text variant="subtitle2" fontWeight="bold" color="text">
              Departman Bilgisi
            </Text>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                business
              </Icon>
              <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                {user?.jobrecordTipi?.toUpperCase() === "AKADEMIK" ? "Bölüm:" : "Birim:"}
              </Text>
              <Text
                variant="body2"
                color={
                  userDeptUuid ||
                  user?.fiiliGorevler?.length > 0 ||
                  user?.bolumId ||
                  user?.birimId ||
                  user?.departmanId ||
                  user?.aktifCalismaYeri?.birimId ||
                  user?.aktifCalismaYeri?.masterBirimId
                    ? "info"
                    : "text"
                }
                fontWeight={
                  userDeptUuid ||
                  user?.fiiliGorevler?.length > 0 ||
                  user?.bolumId ||
                  user?.birimId ||
                  user?.departmanId ||
                  user?.aktifCalismaYeri?.birimId ||
                  user?.aktifCalismaYeri?.masterBirimId
                    ? "bold"
                    : "regular"
                }
                onClick={() => {
                  const activeFiiliGorev =
                    user?.fiiliGorevler?.find((g) => g.aktif) || user?.fiiliGorevler?.[0];
                  if (userDeptUuid) {
                    navigate(`/records/department-details/${userDeptUuid}`);
                  } else {
                    const routeId =
                      activeFiiliGorev?.birimId ||
                      user?.bolumId ||
                      user?.birimId ||
                      user?.departmanId ||
                      user?.aktifCalismaYeri?.birimId ||
                      user?.aktifCalismaYeri?.masterBirimId;
                    if (routeId) {
                      navigate(`/records/department-details/${routeId}`);
                    }
                  }
                }}
                sx={{
                  cursor:
                    userDeptUuid ||
                    user?.fiiliGorevler?.length > 0 ||
                    user?.bolumId ||
                    user?.birimId ||
                    user?.departmanId ||
                    user?.aktifCalismaYeri?.birimId ||
                    user?.aktifCalismaYeri?.masterBirimId
                      ? "pointer"
                      : "default",
                  "&:hover": {
                    textDecoration:
                      userDeptUuid ||
                      user?.fiiliGorevler?.length > 0 ||
                      user?.bolumId ||
                      user?.birimId ||
                      user?.departmanId ||
                      user?.aktifCalismaYeri?.birimId ||
                      user?.aktifCalismaYeri?.masterBirimId
                        ? "underline"
                        : "none",
                  },
                }}
              >
                {user?.fiiliGorevler?.find((g) => g.aktif)?.birimAd ||
                  user?.fiiliGorevler?.[0]?.birimAd ||
                  user?.bolumAdi ||
                  user?.birimAdi ||
                  user?.aktifCalismaYeri?.birimAd ||
                  user?.aktifCalismaYeri?.masterBirimAd ||
                  user?.personnelTree?.[0]?.name ||
                  "—"}
              </Text>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box display="flex" alignItems="flex-start" mb={1}>
              <Icon fontSize="medium" color="secondary" sx={{ mr: 1, mt: 0.5 }}>
                account_tree
              </Icon>
              <Box>
                <Text
                  variant="body2"
                  fontWeight="bold"
                  color="secondary"
                  sx={{ mr: 1, display: "inline-block", mt: 0.5 }}
                >
                  Org. Konum:
                </Text>
                {orgPath && orgPath.length > 0 ? (
                  <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                    {orgPath.map((node, i) => (
                      <Box key={node.key} display="flex" alignItems="center">
                        <Box display="flex" flexDirection="column" alignItems="center" mr={0.5}>
                          <Badge
                            variant="gradient"
                            color={i === orgPath.length - 1 ? "info" : "light"}
                            size="md"
                            badgeContent={node.title}
                            sx={{
                              textTransform: "none",
                              cursor: "pointer",
                              "&:hover": { opacity: 0.8 },
                            }}
                            onClick={() => navigate(`/records/department-details/${node.key}`)}
                          />
                          {(node.userName || node.userSurname) && (
                            <Text
                              variant="body2"
                              color="text"
                              fontWeight="medium"
                              sx={{ mt: 0.5, fontStyle: "italic" }}
                            >
                              {`${node.userName || ""} ${node.userSurname || ""}`.trim()}
                            </Text>
                          )}
                        </Box>
                        {i < orgPath.length - 1 && (
                          <Icon fontSize="medium" color="secondary" sx={{ mr: 0.5 }}>
                            chevron_right
                          </Icon>
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Text variant="body2" color="text" sx={{ mt: 0.5, display: "inline-block" }}>
                    {user?.personnelTree?.[user?.personnelTree?.length - 1]?.name ||
                      user?.fiiliGorevler?.find((g) => g.aktif)?.birimAd ||
                      user?.fiiliGorevler?.[0]?.birimAd ||
                      user?.bolumAdi ||
                      user?.birimAdi ||
                      user?.aktifCalismaYeri?.birimAd ||
                      "-"}
                  </Text>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}
