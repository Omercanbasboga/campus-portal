import React from "react";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

import Box from "ui/Box";
import Text from "ui/Text";

export default function PersonalInfoTab({ student, DetailItem }) {
  return (
    <Card sx={{ height: "100%" }}>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Text variant="h5" fontWeight="medium">
            Kişisel Bilgiler
          </Text>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DetailItem icon="public" label="Uyruk" value={student?.uyruk} />
            <DetailItem icon="wc" label="Cinsiyet" value={student?.cinsiyet} />
            <DetailItem icon="badge" label="T.C. Kimlik" value={student?.tckimlik} />
            <DetailItem icon="badge" label="Pasaport No" value={student?.pasaportNo} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DetailItem icon="email" label="E-Posta" value={student?.email} />
            <DetailItem icon="email" label="Okul e-postası" value={student?.okulEmail} />
            <DetailItem icon="phone_iphone" label="Cep Telefonu" value={student?.ceptel} />
            <DetailItem icon="phone" label="Telefon" value={student?.telefon} />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Text variant="subtitle2" fontWeight="bold" color="text">
              Adres Detayları
            </Text>
          </Grid>

          <Grid item xs={12}>
            <DetailItem icon="location_on" label="Adres 1" value={student?.adres1} />
            {student?.adres2 && (
              <DetailItem icon="location_on" label="Adres 2" value={student?.adres2} />
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <DetailItem icon="map" label="İl" value={student?.il} />
            <DetailItem icon="map" label="İlçe" value={student?.ilce} />
          </Grid>
          <Grid item xs={12} sm={6}>
            {(student?.il2 || student?.ilce2) && (
              <>
                <DetailItem icon="map" label="İl 2" value={student?.il2} />
                <DetailItem icon="map" label="İlçe 2" value={student?.ilce2} />
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}
