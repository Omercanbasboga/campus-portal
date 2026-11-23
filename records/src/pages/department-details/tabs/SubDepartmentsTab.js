import React from "react";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Box from "ui/Box";
import Text from "ui/Text";

export default function SubDepartmentsTab({ subTreeLoading, pathTree, subTree }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: "100%" }}>
      <Box p={3}>
        <Text variant="h5" fontWeight="medium" mb={2}>
          Bağlı Olduğu Birimler
        </Text>

        {subTreeLoading ? (
          <Box py={3} textAlign="center">
            <Text variant="body1" color="text">
              Yükleniyor...
            </Text>
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Text
                variant="subtitle2"
                color="secondary"
                fontWeight="bold"
                ml={0.5}
                sx={{ textTransform: "uppercase" }}
              >
                Üst Birimler
              </Text>
              {pathTree.length > 0 ? (
                <List disablePadding sx={{ maxHeight: "260px", overflowY: "auto", pr: 0.5 }}>
                  {pathTree.map((parent, index) => (
                    <div key={parent.id || index}>
                      <ListItem
                        sx={{
                          py: 1.5,
                          px: 0,
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "rgba(0,0,0,0.04)", borderRadius: 1 },
                        }}
                        onClick={() => navigate(`/records/department-details/${parent.id}`)}
                      >
                        <ListItemIcon sx={{ minWidth: 40, ml: (parent.depth || index) * 0.5 }}>
                          <Icon color="secondary" fontSize="medium">
                            arrow_upward
                          </Icon>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Text variant="subtitle2" fontWeight="bold" color="text">
                              {parent.name}
                            </Text>
                          }
                          secondary={
                            parent.nodeType && (
                              <Text variant="body2" color="secondary">
                                {parent.nodeType}
                              </Text>
                            )
                          }
                        />
                        <Icon color="secondary" fontSize="medium">
                          chevron_right
                        </Icon>
                      </ListItem>
                      {index < pathTree.length - 1 && <Divider sx={{ m: 0 }} />}
                    </div>
                  ))}
                </List>
              ) : (
                <Box py={2} textAlign="center">
                  <Text variant="body1" color="text">
                    Üst birim bulunamadı.
                  </Text>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Text
                variant="subtitle2"
                color="secondary"
                fontWeight="bold"
                ml={0.5}
                sx={{ textTransform: "uppercase" }}
              >
                Alt Birimler
              </Text>
              {subTree.length > 0 ? (
                <List disablePadding sx={{ maxHeight: "260px", overflowY: "auto", pr: 0.5 }}>
                  {subTree.map((child, index) => (
                    <div key={child.id || index}>
                      <ListItem
                        sx={{
                          py: 1.5,
                          px: 0,
                          pl: (child._depth || 0) * 2,
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "rgba(0,0,0,0.04)", borderRadius: 1 },
                        }}
                        onClick={() => navigate(`/records/department-details/${child.id}`)}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Icon color="info" fontSize="medium">
                            {(child._depth || 0) === 0
                              ? "account_tree"
                              : "subdirectory_arrow_right"}
                          </Icon>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Text variant="subtitle2" fontWeight="bold" color="text">
                              {child.name}
                            </Text>
                          }
                          secondary={
                            child.nodeType && (
                              <Text variant="body2" color="secondary">
                                {child.nodeType}
                              </Text>
                            )
                          }
                        />
                        <Icon color="secondary" fontSize="medium">
                          chevron_right
                        </Icon>
                      </ListItem>
                      {index < subTree.length - 1 && <Divider sx={{ m: 0 }} />}
                    </div>
                  ))}
                </List>
              ) : (
                <Box py={4} textAlign="center">
                  <Icon fontSize="large" color="secondary" sx={{ opacity: 0.5 }}>
                    info
                  </Icon>
                  <Text variant="body1" color="text" mt={1}>
                    Bu birime bağlı alt birim bulunmamaktadır.
                  </Text>
                </Box>
              )}
            </Grid>
          </Grid>
        )}
      </Box>
    </Card>
  );
}
