import React from "react";

import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Box from "ui/Box";
import Text from "ui/Text";

export default function ClubsInfoTab({ student, formatDateTR }) {
  return (
    <Card sx={{ height: "100%" }}>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Text variant="h5" fontWeight="medium">
            Bağlı Olduğu Kulüpler
          </Text>
        </Box>

        <Box mt={2}>
          {student?.kulupler && student.kulupler.length > 0 ? (
            <List disablePadding>
              {student.kulupler.map((kulup, index) => (
                <div key={index}>
                  <ListItem sx={{ py: 1.5, px: 0, display: "flex", alignItems: "center" }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Icon fontSize="medium" color="info">
                        groups
                      </Icon>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Text variant="subtitle2" fontWeight="bold" color="text">
                          {kulup.adi || kulup.name || "Bilinmeyen Kulüp"}
                        </Text>
                      }
                      secondary={
                        kulup.kayitTarihi && (
                          <Text variant="body2" color="secondary">
                            Kayıt Tarihi: {formatDateTR(kulup.kayitTarihi)}
                          </Text>
                        )
                      }
                    />
                  </ListItem>
                  {index < student.kulupler.length - 1 && <Divider sx={{ m: 0 }} />}
                </div>
              ))}
            </List>
          ) : (
            <Box py={3} textAlign="center">
              <Icon fontSize="large" color="secondary" sx={{ opacity: 0.5 }}>
                info
              </Icon>
              <Text variant="body1" color="text" mt={1}>
                Öğrencinin bağlı olduğu herhangi bir kulüp kaydı bulunamadı.
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
}
