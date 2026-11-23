import React from "react";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Box from "ui/Box";
import Text from "ui/Text";
import Button from "ui/Button";
import Avatar from "ui/Avatar";

export default function PersonnelListTab({
  personelList,
  personelLoading,
  personelType,
  setPersonelType,
  personelPage,
  setPersonelPage,
  personelSize,
  setPersonelSize,
}) {
  const navigate = useNavigate();

  return (
    <Card>
      <Box
        px={3}
        py={{ xs: 1, lg: 2 }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
        borderBottom="1px solid rgba(0,0,0,0.08)"
      >
        <Text variant="h5" fontWeight="medium">
          Personel Listesi
          {personelList.length > 0 && (
            <Text component="span" variant="body2" color="secondary" ml={1}>
              ({personelList.length} kişi)
            </Text>
          )}
        </Text>

        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <Button
            variant={personelType === "all" ? "gradient" : "outlined"}
            color="info"
            size="sm"
            onClick={() => {
              setPersonelType("all");
              setPersonelPage(0);
            }}
          >
            Tümü
          </Button>
          <Button
            variant={personelType === "idari" ? "gradient" : "outlined"}
            color="info"
            size="sm"
            onClick={() => {
              setPersonelType("idari");
              setPersonelPage(0);
            }}
          >
            İdari
          </Button>
          <Button
            variant={personelType === "akademik" ? "gradient" : "outlined"}
            color="info"
            size="sm"
            onClick={() => {
              setPersonelType("akademik");
              setPersonelPage(0);
            }}
          >
            Akademik
          </Button>
        </Box>
      </Box>

      <Box px={3} pb={2}>
        {personelLoading ? (
          <Box py={4} textAlign="center">
            <Text variant="body1" color="text">
              Yükleniyor...
            </Text>
          </Box>
        ) : personelList.length > 0 ? (
          <List disablePadding>
            {personelList
              .slice(personelPage * personelSize, (personelPage + 1) * personelSize)
              .map((user, index, arr) => (
                <div key={user.id || index}>
                  <ListItem
                    sx={{
                      py: { xs: 0.5, lg: 1.5 },
                      px: 0,
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                    }}
                    onClick={() => navigate(`/records/user-details/${user.id}`)}
                  >
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <Avatar
                        alt={user.adSoyad || user.ad}
                        size="md"
                        variant="rounded"
                        sx={{ bgcolor: ({ palette: { info } }) => info.main + "22" }}
                      >
                        <Icon
                          fontSize="medium"
                          sx={{ color: ({ palette: { info } }) => info.main }}
                        >
                          person
                        </Icon>
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Text variant="subtitle2" fontWeight="bold" color="text">
                          {user.adSoyad ||
                            `${user.ad || ""} ${user.soyad || ""}`.trim() ||
                            "İsimsiz Personel"}
                        </Text>
                      }
                      secondary={
                        user.unvan?.ad && (
                          <Text variant="body2" color="secondary">
                            {user.unvan.ad}
                          </Text>
                        )
                      }
                    />
                  </ListItem>
                  {index < arr.length - 1 && <Divider sx={{ m: 0 }} />}
                </div>
              ))}
          </List>
        ) : (
          <Box py={4} textAlign="center">
            <Icon fontSize="large" color="secondary" sx={{ opacity: 0.4 }}>
              group_off
            </Icon>
            <Text variant="body1" color="text" mt={1}>
              Bu birime bağlı personel kaydı bulunmamaktadır.
            </Text>
          </Box>
        )}
      </Box>

      {Math.ceil(personelList.length / personelSize) > 1 && (
        <Box
          px={3}
          py={{ xs: 1, lg: 1.5 }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderTop="1px solid rgba(0,0,0,0.08)"
        >
          <Box display="flex" alignItems="center" gap={0.5}>
            {[5, 10, 25].map((n) => (
              <Button
                key={n}
                variant={personelSize === n ? "gradient" : "text"}
                color={personelSize === n ? "info" : "secondary"}
                size="sm"
                sx={{ minWidth: 32, px: 0.5 }}
                onClick={() => {
                  setPersonelSize(n);
                  setPersonelPage(0);
                }}
              >
                {n}
              </Button>
            ))}
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Button
              variant="text"
              color="secondary"
              size="sm"
              disabled={personelPage === 0}
              onClick={() => setPersonelPage((p) => Math.max(0, p - 1))}
              sx={{ minWidth: 32, px: 0.5 }}
            >
              <Icon fontSize="medium">navigate_before</Icon>
            </Button>
            <Text variant="body2" color="text" fontWeight="medium" sx={{ whiteSpace: "nowrap" }}>
              {personelPage + 1} / {Math.max(1, Math.ceil(personelList.length / personelSize))}
            </Text>
            <Button
              variant="text"
              color="secondary"
              size="sm"
              disabled={personelPage >= Math.ceil(personelList.length / personelSize) - 1}
              onClick={() => setPersonelPage((p) => p + 1)}
              sx={{ minWidth: 32, px: 0.5 }}
            >
              <Icon fontSize="medium">navigate_next</Icon>
            </Button>
          </Box>
        </Box>
      )}
    </Card>
  );
}
