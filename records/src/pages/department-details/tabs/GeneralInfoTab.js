import React from "react";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

import Box from "ui/Box";
import Text from "ui/Text";

export default function GeneralInfoTab({ department, managerName, loading, error, DetailItem }) {
  return (
    <Card sx={{ height: "100%" }}>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Text variant="h5" fontWeight="medium">
            Genel Bilgiler
          </Text>
        </Box>

        {error ? (
          <Box py={3} textAlign="center">
            <Icon fontSize="large" color="error" sx={{ opacity: 0.6 }}>
              error
            </Icon>
            <Text variant="body1" color="error" mt={1}>
              {error}
            </Text>
          </Box>
        ) : loading ? (
          <Box py={3} textAlign="center">
            <Text variant="body1" color="text">
              Yükleniyor...
            </Text>
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DetailItem icon="label" label="Birim Adı" value={department?.name} />
              <DetailItem icon="category" label="Birim Tipi" value={department?.nodeType} />
              <DetailItem
                icon="account_tree"
                label="Üst Birim Adı"
                value={department?.parentName || "Yok"}
              />
              <DetailItem icon="fingerprint" label="Uniq ID" value={department?.uniqId} />
              <DetailItem
                icon="person"
                label="Yönetici"
                value={managerName || department?.userId || "Atanmamış"}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DetailItem
                icon="info"
                label="Durum"
                value={department?.isActive ? "Aktif" : "Pasif"}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Card>
  );
}
