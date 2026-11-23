import React from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import { Tree } from "antd";
import Box from "ui/Box";
import Text from "ui/Text";

export default function PersonalInfoTab({
  user,
  hierarchyTree,
  expandedOrgKeys,
  setExpandedOrgKeys,
  handleOrgSelect,
  formatDateTR,
  DetailItem,
}) {
  return (
    <Card sx={{ height: "100%" }}>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Text variant="h5" fontWeight="medium">
            Personel Bilgileri
          </Text>
        </Box>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                person
              </Icon>
              <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                Ad Soyad:
              </Text>
              <Text variant="body2" color="text">
                {user ? `${user.ad || ""} ${user.soyad || ""}` : "-"}
              </Text>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                email
              </Icon>
              <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                E-posta:
              </Text>
              <Text variant="body2" color="text">
                {user?.kurumEmail || "-"}
              </Text>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                phone
              </Icon>
              <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                Telefon:
              </Text>
              <Text variant="body2" color="text">
                {user?.cepTel || "-"}
              </Text>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                badge
              </Icon>
              <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                TC Kimlik No:
              </Text>
              <Text variant="body2" color="text">
                {user?.tckimlikno || "-"}
              </Text>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                cake
              </Icon>
              <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                Doğum Tarihi:
              </Text>
              <Text variant="body2" color="text">
                {formatDateTR(user?.dogumTarihi)}
              </Text>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
                wc
              </Icon>
              <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                Cinsiyet:
              </Text>
              <Text variant="body2" color="text">
                {user?.cinsiyet || "-"}
              </Text>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Icon
                fontSize="medium"
                sx={{
                  mr: 1,
                  color: user?.jobrecordDurum === "Aktif" ? "success.main" : "error.main",
                }}
              >
                {user?.jobrecordDurum === "Aktif" ? "check_circle" : "cancel"}
              </Icon>
              <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
                Durum:
              </Text>
              <Text
                variant="body2"
                color={user?.jobrecordDurum === "Aktif" ? "success" : "error"}
                fontWeight="bold"
              >
                {user?.jobrecordDurum === "Aktif" ? "Aktif" : "Pasif"}
              </Text>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 1 }} />
        <Text variant="subtitle2" fontWeight="bold" color="text">
          Organizasyondaki Konumu
        </Text>
        <Text variant="body2" color="secondary" display="block" mb={2} mt={0.5}>
          Rektörden bu kişiye kadar olan kademeli hiyerarşi. Tıklayarak Org. Şeması sayfasına gidin.
        </Text>
        {hierarchyTree.length > 0 ? (
          <Tree
            treeData={hierarchyTree}
            expandedKeys={expandedOrgKeys}
            onExpand={(keys) => setExpandedOrgKeys(keys)}
            showLine={{ showLeafIcon: false }}
            blockNode
            onSelect={handleOrgSelect}
          />
        ) : (
          <Text variant="body1" color="text">
            Bu kullanıcı için organizasyon hiyerarşisi bulunamadı.
          </Text>
        )}
      </Box>
    </Card>
  );
}
