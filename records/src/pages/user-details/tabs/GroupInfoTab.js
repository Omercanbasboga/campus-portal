import React from "react";
import Card from "@mui/material/Card";
import Box from "ui/Box";
import Text from "ui/Text";

export default function GroupInfoTab() {
  return (
    <Card sx={{ height: "100%" }}>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Text variant="h5" fontWeight="medium">
            Grup Bilgileri
          </Text>
        </Box>
        <Box mt={1} mb={2}>
          <Text variant="body1" color="text">
            Grup üyelikleri ve roller burada görüntülenecek.
          </Text>
        </Box>
      </Box>
    </Card>
  );
}
