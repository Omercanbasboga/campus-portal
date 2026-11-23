import React, { useState, useEffect } from "react";

import api from "api/client";

import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Box from "ui/Box";
import Text from "ui/Text";
import Avatar from "ui/Avatar";
import Badge from "ui/Badge";

export default function FamilyInfoTab({ user, formatDateTR }) {
  const [relatives, setRelatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatives = async () => {
      const tcNo = user?.tckimlikno || user?.tckimlik || user?.tcKimlikNo;

      if (!tcNo) {
        if (user) {
          setError("Personelin T.C. Kimlik bilgisi bulunamadı.");
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/v1/personel/relatives/${String(tcNo)}`);

        const data = response.data?.data || response.data?.content || response.data || [];
        setRelatives(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Yakın bilgileri çekilemedi:", err);
        setError("Yakın bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatives();
  }, [user]);

  const getRelationshipColor = (derece) => {
    const d = (derece || "").toLowerCase();
    if (d.includes("eş")) return "info";
    if (d.includes("çocuk") || d.includes("kız") || d.includes("oğul")) return "success";
    if (d.includes("anne") || d.includes("baba")) return "primary";
    return "secondary";
  };

  return (
    <Card sx={{ height: "100%" }}>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Text variant="h5" fontWeight="medium">
            Aile ve Yakın Bilgileri
          </Text>
        </Box>

        {loading ? (
          <Box py={4} textAlign="center">
            <Text variant="body1" color="text">
              Yakın bilgileri yükleniyor...
            </Text>
          </Box>
        ) : error ? (
          <Box py={4} textAlign="center">
            <Icon fontSize="large" color="error" sx={{ opacity: 0.5 }}>
              error_outline
            </Icon>
            <Text variant="body1" color="error" mt={1}>
              {error}
            </Text>
          </Box>
        ) : relatives.length > 0 ? (
          <List disablePadding>
            {relatives.map((rel, index) => (
              <div key={rel.YakinTCKimlikNo || index}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 0,
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Avatar
                      size="md"
                      variant="rounded"
                      sx={{ bgcolor: ({ palette: { secondary } }) => secondary.main + "22" }}
                    >
                      <Icon
                        fontSize="medium"
                        sx={{ color: ({ palette: { secondary } }) => secondary.main }}
                      >
                        {rel.YakinCinsiyet === "K" || rel.YakinCinsiyet === "Kadın"
                          ? "woman"
                          : "man"}
                      </Icon>
                    </Avatar>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Text variant="subtitle2" fontWeight="bold" color="text">
                        {rel.YakinAd} {rel.YakinSoyad}
                      </Text>
                    }
                    secondary={
                      <Box display="flex" flexDirection="column" mt={0.5}>
                        <Text variant="body2" color="secondary">
                          TC: {rel.YakinTCKimlikNo || "-"}
                        </Text>
                        {rel.YakinDogumTarihi && (
                          <Text variant="body2" color="secondary">
                            Doğum Tarihi: {formatDateTR(rel.YakinDogumTarihi)}
                          </Text>
                        )}
                      </Box>
                    }
                  />

                  <Box display="flex" alignItems="center" gap={1} ml="auto">
                    {rel.YakinIsDurumu && (
                      <Badge
                        variant="gradient"
                        color="dark"
                        size="md"
                        badgeContent={rel.YakinIsDurumu}
                        container
                      />
                    )}
                    <Badge
                      variant="gradient"
                      color={getRelationshipColor(rel.YakinlikDerecesi)}
                      size="md"
                      badgeContent={rel.YakinlikDerecesi || "Bilinmiyor"}
                      container
                    />
                  </Box>
                </ListItem>
                {index < relatives.length - 1 && <Divider sx={{ m: 0 }} />}
              </div>
            ))}
          </List>
        ) : (
          <Box py={5} textAlign="center">
            <Icon fontSize="large" color="secondary" sx={{ opacity: 0.5 }}>
              family_restroom
            </Icon>
            <Text variant="body1" color="text" mt={1}>
              Personelin kayıtlı aile/yakın bilgisi bulunmamaktadır.
            </Text>
          </Box>
        )}
      </Box>
    </Card>
  );
}
