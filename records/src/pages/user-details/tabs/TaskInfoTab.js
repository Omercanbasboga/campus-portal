import React from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "ui/Box";
import Text from "ui/Text";

export default function TaskInfoTab({ user, taskTabValue, formatDateTR, DetailItem }) {
  return (
    <Card sx={{ height: "100%" }}>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Text variant="h5" fontWeight="medium">
            {taskTabValue === 0 ? "İdari Görev Bilgileri" : "Fiili Görev Bilgileri"}
          </Text>
        </Box>
        {taskTabValue === 0 && (
          <List disablePadding>
            {user?.idariGorevler && user.idariGorevler.length > 0 ? (
              user.idariGorevler.map((gorev, idx) => (
                <div key={idx}>
                  <ListItem
                    sx={{ flexDirection: "column", alignItems: "flex-start", px: 0, py: 2 }}
                  >
                    <Box display="flex" alignItems="center" width="100%">
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="3rem"
                        height="3rem"
                        borderRadius="md"
                        bgColor="info"
                        variant="gradient"
                        color="white"
                        mr={2}
                      >
                        <Icon fontSize="medium">account_balance</Icon>
                      </Box>
                      <Box display="flex" flexDirection="column" width="100%">
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          width="100%"
                        >
                          <Text variant="subtitle2" fontWeight="bold" color="text">
                            {gorev.unvanAd || "-"}
                          </Text>
                          <Text variant="body2" color="secondary" fontWeight="medium">
                            Başlangıç: {formatDateTR(gorev.baslangicTarihi)}
                          </Text>
                        </Box>
                        <Text variant="body2" color="text">
                          {gorev.birimAd || "-"}
                        </Text>
                      </Box>
                    </Box>
                    <Box
                      mt={1.5}
                      pl={8}
                      width="100%"
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Box display="flex" gap={3} flexWrap="wrap">
                        <DetailItem
                          icon="bar_chart"
                          label="Unvan Seviye"
                          value={gorev.unvanSeviye}
                        />
                        <DetailItem
                          icon="gavel"
                          label="Vekaleten"
                          value={gorev.isVekaleten ? "Evet" : "Hayır"}
                        />
                      </Box>
                    </Box>
                  </ListItem>
                  <Divider sx={{ m: 0 }} />
                </div>
              ))
            ) : (
              <Box py={2}>
                <Text variant="body2" color="text">
                  Kayıtlı idari görev bulunamadı.
                </Text>
              </Box>
            )}
          </List>
        )}
        {taskTabValue === 1 && (
          <List disablePadding>
            {user?.fiiliGorevler && user.fiiliGorevler.length > 0 ? (
              user.fiiliGorevler.map((gorev, idx) => (
                <div key={idx}>
                  <ListItem
                    sx={{ flexDirection: "column", alignItems: "flex-start", px: 0, py: 2 }}
                  >
                    <Box display="flex" alignItems="center" width="100%">
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="3rem"
                        height="3rem"
                        borderRadius="md"
                        bgColor="success"
                        variant="gradient"
                        color="white"
                        mr={2}
                      >
                        <Icon fontSize="medium">assignment_ind</Icon>
                      </Box>
                      <Box display="flex" flexDirection="column" width="100%">
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          width="100%"
                        >
                          <Text variant="subtitle2" fontWeight="bold" color="text">
                            {gorev.birimAd || "-"}
                          </Text>
                          <Text variant="body2" color="secondary" fontWeight="medium">
                            Başlangıç: {formatDateTR(gorev.baslangicTarihi)}
                          </Text>
                        </Box>
                        <Text variant="body2" color="text">
                          {gorev.masterBirimAd || "-"}
                        </Text>
                      </Box>
                    </Box>
                    <Box
                      mt={1.5}
                      pl={8}
                      width="100%"
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Box display="flex" gap={3} flexWrap="wrap">
                        <DetailItem
                          icon="verified_user"
                          label="Asil mi"
                          value={gorev.isAsil ? "Evet" : "Hayır"}
                        />
                        <DetailItem
                          icon="rule"
                          label="13b/4"
                          value={gorev.is13b4 ? "Evet" : "Hayır"}
                        />
                      </Box>
                    </Box>
                  </ListItem>
                  <Divider sx={{ m: 0 }} />
                </div>
              ))
            ) : (
              <Box py={2}>
                <Text variant="body2" color="text">
                  Kayıtlı fiili görev bulunamadı.
                </Text>
              </Box>
            )}
          </List>
        )}
      </Box>
    </Card>
  );
}
