import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import api from "api/client";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Box from "ui/Box";
import Page from "ui/Page";
import Text from "ui/Text";
import Badge from "ui/Badge";
import Avatar from "ui/Avatar";

import GeneralInfoTab from "./tabs/GeneralInfoTab";
import SubDepartmentsTab from "./tabs/SubDepartmentsTab";
import PersonnelListTab from "./tabs/PersonnelListTab";
import StudentListTab from "./tabs/StudentListTab";

const DetailItem = ({
  icon,
  label,
  value,
  iconColor = "secondary",
  labelColor = "secondary",
  valueColor = "text",
}) => (
  <Box display="flex" alignItems="center" mb={1.5}>
    <Icon fontSize="medium" color={iconColor} sx={{ mr: 1 }}>
      {icon}
    </Icon>
    <Text variant="body1" fontWeight="bold" color={labelColor} sx={{ mr: 0.5 }}>
      {label}:
    </Text>
    <Text variant="body1" color={valueColor} fontWeight="regular">
      {value || "-"}
    </Text>
  </Box>
);

DetailItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconColor: PropTypes.string,
  labelColor: PropTypes.string,
  valueColor: PropTypes.string,
};

function DepartmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);
  const [department, setDepartment] = useState(null);
  const [managerName, setManagerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [subTree, setSubTree] = useState([]);
  const [pathTree, setPathTree] = useState([]);
  const [subTreeLoading, setSubTreeLoading] = useState(false);
  const [error, setError] = useState(null);

  const [personelType, setPersonelType] = useState("all");
  const [personelList, setPersonelList] = useState([]);
  const [personelLoading, setPersonelLoading] = useState(false);
  const [personelPage, setPersonelPage] = useState(0);
  const [personelSize, setPersonelSize] = useState(5);

  const [studentList, setStudentList] = useState([]);
  const [studentPage, setStudentPage] = useState(0);
  const [studentSize, setStudentSize] = useState(5);
  const [studentTotalPages, setStudentTotalPages] = useState(0);
  const [studentLoading, setStudentLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setTabValue(0);
    setSubTree([]);
    setPathTree([]);
    setDepartment(null);
    setManagerName("");

    const fetchDepartment = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/api/departments/${id}`);
        const raw = response.data?.data || response.data?.content || response.data;

        const safe = {
          parentName: raw?.parentUnit,
          id: raw?.id,
          name: raw?.name,
          nodeType: raw?.nodeType,
          nodeId: raw?.nodeId,
          uniqId: raw?.uniqId,
          parentUnit: raw?.parentUnit,
          isActive: raw?.isActive,
          userId: raw?.userId,
          createdDate: raw?.createdDate,
          updateDate: raw?.updateDate,
          children: raw?.children || [],
          users: [],
        };

        setDepartment(safe);

        if (safe?.userId) {
          api
            .get(`/api/v1/personel/${safe.userId}`)
            .then((res) => {
              const p = res.data?.data || res.data?.content || res.data;
              const name = p?.adSoyad || (p?.ad ? `${p.ad} ${p.soyad}` : safe.userId);
              setManagerName(name);
            })
            .catch((e) => {
              console.error("Yönetici bilgisi alınamadı:", e);
              setManagerName(safe.userId);
            });
        }
      } catch (e) {
        console.error("Birim bilgisi alınamadı:", e);
        setError("Birim bilgisi alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  useEffect(() => {
    if (!id || tabValue !== 2) return;

    const fetchPersonel = async () => {
      try {
        setPersonelLoading(true);
        let url = `/api/v1/personel/${id}/personel`;
        if (personelType === "idari") {
          url = `/api/v1/personel/${id}/personel/idari`;
        } else if (personelType === "akademik") {
          url = `/api/v1/personel/${id}/personel/akademik`;
        }

        const res = await api.get(url);
        const data = res.data?.data || res.data?.content || res.data || [];
        setPersonelList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Personel bilgisi alınamadı:", err);
        setPersonelList([]);
      } finally {
        setPersonelLoading(false);
      }
    };

    fetchPersonel();
  }, [id, tabValue, personelType]);

  useEffect(() => {
    if (!id || tabValue !== 3) return;

    const fetchStudents = async () => {
      try {
        setStudentLoading(true);
        const res = await api.get(
          `/api/v1/students/bolum/${id}?page=${studentPage}&size=${studentSize}`
        );
        const result = res.data?.data || res.data;
        const items = result?.content || [];
        setStudentList(Array.isArray(items) ? items : []);
        setStudentTotalPages(result?.totalPages || 0);
      } catch (err) {
        console.error("Öğrenci bilgisi alınamadı:", err);
        setStudentList([]);
      } finally {
        setStudentLoading(false);
      }
    };

    fetchStudents();
  }, [id, tabValue, studentPage, studentSize]);

  const handleSetTabValue = (newValue) => {
    setTabValue(newValue);
    if (newValue === 1 && id) {
      setSubTreeLoading(true);
      Promise.allSettled([
        api.get(`/api/departments/${id}/tree`),
        api.get(`/api/departments/${id}/path`),
      ])
        .then(([treeResult, pathResult]) => {
          if (treeResult.status === "fulfilled") {
            const raw =
              treeResult.value.data?.data ||
              treeResult.value.data?.content ||
              treeResult.value.data;
            const flattenTree = (nodes, depth = 0) => {
              if (!nodes || !nodes.length) return [];
              return nodes.flatMap((n) => [
                { ...n, _depth: depth },
                ...flattenTree(n.children, depth + 1),
              ]);
            };
            setSubTree(flattenTree(raw?.children || []));
          } else {
            setSubTree([]);
          }
          if (pathResult.status === "fulfilled") {
            const pathRaw =
              pathResult.value.data?.data ||
              pathResult.value.data?.content ||
              pathResult.value.data;
            const pathArr = Array.isArray(pathRaw) ? pathRaw : [];
            const reversedPath = [...pathArr];
            setPathTree(reversedPath.filter((p) => p.id !== id));
          } else {
            setPathTree([]);
          }
        })
        .finally(() => setSubTreeLoading(false));
    }
  };

  const headerTitle = loading ? "Yükleniyor..." : department ? department.name : "Birim Bulunamadı";

  return (
    <Page>
      <Box position="relative" mb={5} mt={2}>
        <Card
          sx={{
            boxShadow: "none",
            py: 3,
            px: 3,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                variant="rounded"
                sx={{
                  width: 150,
                  height: 150,
                  boxShadow: "none",
                  bgcolor: "#f8f9fa",
                }}
              >
                <Icon sx={{ fontSize: "5rem !important", color: "#ced4da" }}>business</Icon>
              </Avatar>
            </Grid>

            <Grid item>
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center" flexWrap="wrap" gap={1.5}>
                  <Text variant="h5" fontWeight="bold">
                    {headerTitle}
                  </Text>

                  {department?.nodeType && (
                    <Badge
                      variant="gradient"
                      badgeContent={department.nodeType}
                      color="info"
                      size="md"
                      container
                    />
                  )}
                  {department?.isActive !== undefined && (
                    <Badge
                      variant="gradient"
                      badgeContent={department.isActive ? "Aktif" : "Pasif"}
                      color={department.isActive ? "success" : "secondary"}
                      size="md"
                      container
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>

      <Box mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} xl={3}>
            <Card sx={{ pt: 2, pb: 2 }}>
              <List
                component="nav"
                sx={{ px: 2, display: "flex", flexDirection: "column", gap: 0.5 }}
              >
                <ListItemButton
                  selected={tabValue === 0}
                  onClick={() => handleSetTabValue(0)}
                  sx={{
                    borderRadius: "md",
                    py: 1.5,
                    "&.Mui-selected": { backgroundColor: "transparent !important" },
                    "&.Mui-selected:hover": { backgroundColor: "rgba(0,0,0,0.04) !important" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon color={tabValue === 0 ? "info" : "inherit"}>info</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Text
                        variant="subtitle2"
                        fontWeight="bold"
                        color={tabValue === 0 ? "info" : "text"}
                      >
                        Genel Bilgiler
                      </Text>
                    }
                  />
                </ListItemButton>

                <ListItemButton
                  selected={tabValue === 1}
                  onClick={() => handleSetTabValue(1)}
                  sx={{
                    borderRadius: "md",
                    py: 1.5,
                    "&.Mui-selected": { backgroundColor: "transparent !important" },
                    "&.Mui-selected:hover": { backgroundColor: "rgba(0,0,0,0.04) !important" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon color={tabValue === 1 ? "info" : "inherit"}>account_tree</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Text
                        variant="subtitle2"
                        fontWeight="bold"
                        color={tabValue === 1 ? "info" : "text"}
                      >
                        Bağlı Olduğu Birimler
                      </Text>
                    }
                  />
                </ListItemButton>

                <ListItemButton
                  selected={tabValue === 2}
                  onClick={() => handleSetTabValue(2)}
                  sx={{
                    borderRadius: "md",
                    py: 1.5,
                    "&.Mui-selected": { backgroundColor: "transparent !important" },
                    "&.Mui-selected:hover": { backgroundColor: "rgba(0,0,0,0.04) !important" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon color={tabValue === 2 ? "info" : "inherit"}>groups</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Text
                        variant="subtitle2"
                        fontWeight="bold"
                        color={tabValue === 2 ? "info" : "text"}
                      >
                        Personel Listesi
                      </Text>
                    }
                  />
                </ListItemButton>

                {department?.nodeType === "AKADEMIK" && (
                  <ListItemButton
                    selected={tabValue === 3}
                    onClick={() => handleSetTabValue(3)}
                    sx={{
                      borderRadius: "md",
                      py: 1.5,
                      "&.Mui-selected": { backgroundColor: "transparent !important" },
                      "&.Mui-selected:hover": { backgroundColor: "rgba(0,0,0,0.04) !important" },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Icon color={tabValue === 3 ? "info" : "inherit"}>school</Icon>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Text
                          variant="subtitle2"
                          fontWeight="bold"
                          color={tabValue === 3 ? "info" : "text"}
                        >
                          Öğrenci Listesi
                        </Text>
                      }
                    />
                  </ListItemButton>
                )}
              </List>
            </Card>
          </Grid>

          <Grid item xs={12} md={8} xl={9}>
            {tabValue === 0 && (
              <GeneralInfoTab
                department={department}
                managerName={managerName}
                loading={loading}
                error={error}
                DetailItem={DetailItem}
              />
            )}

            {tabValue === 1 && (
              <SubDepartmentsTab
                subTreeLoading={subTreeLoading}
                pathTree={pathTree}
                subTree={subTree}
              />
            )}

            {tabValue === 2 && (
              <PersonnelListTab
                personelList={personelList}
                personelLoading={personelLoading}
                personelType={personelType}
                setPersonelType={setPersonelType}
                personelPage={personelPage}
                setPersonelPage={setPersonelPage}
                personelSize={personelSize}
                setPersonelSize={setPersonelSize}
              />
            )}

            {tabValue === 3 && department?.nodeType === "AKADEMIK" && (
              <StudentListTab
                studentList={studentList}
                studentLoading={studentLoading}
                studentPage={studentPage}
                setStudentPage={setStudentPage}
                studentSize={studentSize}
                setStudentSize={setStudentSize}
                studentTotalPages={studentTotalPages}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
}

export default DepartmentDetails;
