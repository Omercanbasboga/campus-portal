import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Tree } from "antd";

import api from "api/client";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import Icon from "@mui/material/Icon";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Box from "ui/Box";
import Page from "ui/Page";
import Text from "ui/Text";
import Avatar from "ui/Avatar";
import Button from "ui/Button";
import Badge from "ui/Badge";

import DeleteUserModal from "./modals/deleteUser";
import EditPersonelModal from "./modals/editPersonel";
import EditGuestModal from "./modals/editGuest";
import EditGroupModal from "./modals/editGroup";
import EditAcademicModal from "./modals/editAcademic";
import EditIdariGorevModal from "./modals/editIdariGorev";
import EditFiiliGorevModal from "./modals/editFiiliGorev";

import PersonalInfoTab from "./tabs/PersonalInfoTab";
import DutyInfoTab from "./tabs/DutyInfoTab";
import GroupInfoTab from "./tabs/GroupInfoTab";
import TaskInfoTab from "./tabs/TaskInfoTab";
import AcademicInfoTab from "./tabs/AcademicInfoTab";
import FamilyInfoTab from "./tabs/FamilyInfoTab";

const findPathByKey = (data, targetKey, path = []) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const newPath = [...path, node];
    if (node.key === targetKey) return newPath;
    if (node.children) {
      const result = findPathByKey(node.children, targetKey, newPath);
      if (result) return result;
    }
  }
  return null;
};

const buildPathTree = (pathNodes) => {
  if (!pathNodes || pathNodes.length === 0) return [];
  const [head, ...rest] = pathNodes;
  return [
    {
      title: head.title,
      key: head.key,
      children: rest.length > 0 ? buildPathTree(rest) : [],
    },
  ];
};
const formatDateTR = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("tr-TR");
};
const DetailItem = ({ icon, label, value }) => (
  <Box display="flex" alignItems="center" mb={1.5}>
    <Icon fontSize="medium" color="secondary" sx={{ mr: 1 }}>
      {icon}
    </Icon>
    <Text variant="body2" fontWeight="bold" color="secondary" sx={{ mr: 0.5 }}>
      {label}:
    </Text>
    <Text variant="body2" color="text">
      {value || "-"}
    </Text>
  </Box>
);
DetailItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
function UserDetails() {
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [taskMenuOpen, setTaskMenuOpen] = useState(false);
  const [taskTabValue, setTaskTabValue] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditPersonelOpen, setIsEditPersonelOpen] = useState(false);
  const [isEditGuestOpen, setIsEditGuestOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isEditIdariGorevOpen, setIsEditIdariGorevOpen] = useState(false);
  const [selectedIdariGorevIndex, setSelectedIdariGorevIndex] = useState(null);
  const [isEditFiiliGorevOpen, setIsEditFiiliGorevOpen] = useState(false);
  const [selectedFiiliGorevIndex, setSelectedFiiliGorevIndex] = useState(null);
  const [isEditAcademicOpen, setIsEditAcademicOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [orgPath, setOrgPath] = useState(null);
  const [hierarchyTree, setHierarchyTree] = useState([]);
  const [userDeptUuid, setUserDeptUuid] = useState(null);
  const [expandedOrgKeys, setExpandedOrgKeys] = useState([]);
  const handleOrgSelect = (selectedKeys) => {
    if (selectedKeys.length > 0) {
      const selectedKey = selectedKeys[0];
      if (selectedKey.startsWith("user-leaf-")) return;

      navigate(`/records/department-details/${selectedKey}`);
    }
  };
  const handleSetTabValue = (event, newValue) => {
    if (newValue === 3) {
      if (!taskMenuOpen) {
        setTaskMenuOpen(true);
        setTabValue(3);
        setTaskTabValue(0);
      } else {
        setTabValue(3);
        setTaskTabValue((prev) => (prev === 0 ? 1 : 0));
      }
      return;
    }
    setTabValue(newValue);
    setTaskMenuOpen(false);
  };
  const handleSetTaskSubTab = (subIndex) => {
    setTabValue(3);
    setTaskTabValue(subIndex);
  };
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const PERSONNEL_INFO_URL = "/api/v1/personel";
  const DEPT_PATH_URL = "/api/departments";
  const buildDeptPathTree = (departments = [], userNode = null) => {
    if (!departments.length) return [];
    const sorted = [...departments];
    const [head, ...rest] = sorted;
    const toNode = (dept, children) => ({
      title: dept.name || dept.fullName || "-",
      key: String(dept.id || dept.uniqId || dept.name),
      children,
      _rawData: dept,
      _pathInfo: [],
    });
    let treeRoot = toNode(head, []);
    let current = treeRoot;
    for (let i = 1; i < sorted.length; i++) {
      const childMode = toNode(sorted[i], []);
      current.children = [childMode];
      current = childMode;
    }
    if (userNode) {
      current.children = [userNode];
    }
    return [treeRoot];
  };
  useEffect(() => {
    const fetchPersonnel = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const detayPromise = api.get(`${PERSONNEL_INFO_URL}/${id}/detay`);
        const basePromise = api.get(`${PERSONNEL_INFO_URL}/${id}`);
        const [detayRes, baseRes] = await Promise.all(
          [detayPromise, basePromise].map((p) => p.catch((e) => e))
        );
        const detayData = detayRes?.data || {};
        const baseData = baseRes?.data || {};
        const mergedUser = {
          ...baseData,
          ...detayData,
          personnelTree: baseData.personnelTree || detayData.personnelTree || [],
        };
        setUser(mergedUser);
        try {
          const activeFiiliGorev =
            mergedUser?.fiiliGorevler?.find((g) => g.aktif) || mergedUser?.fiiliGorevler?.[0];
          const uniqId =
            activeFiiliGorev?.bolumId ||
            mergedUser?.bolumId ||
            mergedUser?.birimId ||
            mergedUser?.departmanId;
          const userNode = {
            key: `user-leaf-${id}`,
            isLeaf: true,
            title: (
              <Box display="flex" alignItems="center">
                <Icon fontSize="small" color="info" sx={{ mr: 1 }}>
                  account_circle
                </Icon>
                <Text variant="button" fontWeight="bold" color="info">
                  {mergedUser?.unvan?.ad || mergedUser?.akademikUnvan?.ad || "Personel"}
                  <Text component="span" variant="caption" color="text" sx={{ ml: 1 }}>
                    ({mergedUser?.ad || ""} {mergedUser?.soyad || ""})
                  </Text>
                </Text>
              </Box>
            ),
          };
          if (uniqId) {
            const hierarchyRes = await api.get(`${DEPT_PATH_URL}/hierarchy/${uniqId}`);
            const hierarchyData = Array.isArray(hierarchyRes.data) ? hierarchyRes.data : [];
            if (hierarchyData.length > 0) {
              hierarchyData.sort((a, b) => (b.sequence || 0) - (a.sequence || 0));
              const orgPathBadges = hierarchyData.map((dept) => ({
                key: String(dept.id || dept.uniqId || dept.name),
                title: dept.name || dept.fullName || "-",
              }));
              setOrgPath(orgPathBadges.length > 0 ? orgPathBadges : null);
              const finalTree = buildDeptPathTree(hierarchyData, userNode);
              setHierarchyTree(finalTree);
              const matchedDept =
                hierarchyData.find(
                  (d) => String(d.uniqId) === String(uniqId) || String(d.nodeId) === String(uniqId)
                ) || hierarchyData[hierarchyData.length - 1];
              if (matchedDept && matchedDept.id) {
                setUserDeptUuid(matchedDept.id);
              }

              const expandKeys = hierarchyData.map((d) => String(d.id || d.uniqId || d.name));
              expandKeys.push(userNode.key);
              setExpandedOrgKeys(expandKeys);
            } else {
              throw new Error("Boş hierarchy verisi");
            }
          } else {
            throw new Error("Personelin birim ID (uniqId) bilgisi bulunamadı");
          }
        } catch (treeErr) {
          console.warn("Hiyerarşi yolu alınamadı, fallback kullanılıyor:", treeErr?.message);
          const fallbackName =
            mergedUser?.birimAdi ||
            mergedUser?.bolumAdi ||
            mergedUser?.aktifCalismaYeri?.birimAd ||
            mergedUser?.aktifCalismaYeri?.masterBirimAd ||
            "-";
          const userNode = {
            key: `user-leaf-${id}`,
            isLeaf: true,
            title: (
              <Box display="flex" alignItems="center">
                <Icon fontSize="small" color="info" sx={{ mr: 1 }}>
                  account_circle
                </Icon>
                <Text variant="button" fontWeight="bold" color="info">
                  {mergedUser?.unvan?.ad || mergedUser?.akademikUnvan?.ad || "Personel"}
                  <Text component="span" variant="caption" color="text" sx={{ ml: 1 }}>
                    ({mergedUser?.ad || ""} {mergedUser?.soyad || ""})
                  </Text>
                </Text>
              </Box>
            ),
          };
          setOrgPath([{ key: "fallback-emp", title: fallbackName }]);
          setHierarchyTree([
            {
              title: fallbackName,
              key: "fallback-emp",
              children: [userNode],
            },
          ]);
          setExpandedOrgKeys(["fallback-emp", userNode.key]);
        }
      } catch (e) {
        console.error("Kullanıcı bilgisi alınamadı:", e);
        setUser(null);
        setError("Kullanıcı bilgisi alınamadı.");
      } finally {
        setLoading(false);
      }
    };
    fetchPersonnel();
  }, [id]);
  const handleEdit = () => {
    if (tabValue === 0) setIsEditPersonelOpen(true);
    else if (tabValue === 1) setIsEditGuestOpen(true);
    else if (tabValue === 2) setIsEditGroupOpen(true);
    else if (tabValue === 4) setIsEditAcademicOpen(true);
  };
  const handleConfirmEdit = async (formData) => {
    setIsEditing(true);
    try {
      console.log(`User ${id} updated successfully with data:`, formData);
      setTimeout(() => {
        setUser((prev) => ({ ...prev, ...formData }));
        setIsEditing(false);
        setIsEditPersonelOpen(false);
        setIsEditGuestOpen(false);
        setIsEditGroupOpen(false);
        setIsEditIdariGorevOpen(false);
        setIsEditFiiliGorevOpen(false);
        setIsEditAcademicOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Kullanıcı güncellenirken hata oluştu:", error);
      setIsEditing(false);
    }
  };
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      console.log(`User ${id} deleted successfully.`);
      setIsDeleteModalOpen(false);
      setTimeout(() => {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Kullanıcı silinirken hata oluştu:", error);
      setIsDeleting(false);
    }
  };
  const handleEditIdariGorev = (index) => {
    setSelectedIdariGorevIndex(index);
    setIsEditIdariGorevOpen(true);
  };
  const handleDeleteIdariGorev = (index) => {
    console.log("Delete idari görev at index:", index);
    const updatedIdariGorevler = [...(user.idariGorevler || [])];
    updatedIdariGorevler.splice(index, 1);
    setUser((prev) => ({ ...prev, idariGorevler: updatedIdariGorevler }));
  };
  const handleEditFiiliGorev = (index) => {
    setSelectedFiiliGorevIndex(index);
    setIsEditFiiliGorevOpen(true);
  };
  const handleDeleteFiiliGorev = (index) => {
    console.log("Delete fiili görev at index:", index);
    const updatedFiiliGorevler = [...(user.fiiliGorevler || [])];
    updatedFiiliGorevler.splice(index, 1);
    setUser((prev) => ({ ...prev, fiiliGorevler: updatedFiiliGorevler }));
  };
  const handleAddIdariGorev = () => {
    setSelectedIdariGorevIndex(null);
    setIsEditIdariGorevOpen(true);
  };
  const handleAddFiiliGorev = () => {
    setSelectedFiiliGorevIndex(null);
    setIsEditFiiliGorevOpen(true);
  };

  return (
    <Page>
      <Box position="relative" mb={5} mt={2}>
        <Card
          sx={{
            boxShadow: "none",
            pt: 0,
            pb: 3,
            overflow: "hidden",
            px: 3,
          }}
        >
          <Box
            aria-hidden
            sx={(t) => ({
              mx: -3,
              mb: -7,
              height: 120,
              backgroundImage: `radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), ${
                t.palette.mode === "dark"
                  ? "linear-gradient(120deg, #2A1F45, #1C2C44 55%, #10343A)"
                  : "linear-gradient(120deg, #6B4E9B, #4F6BED 55%, #0E9AA7)"
              }`,
              backgroundSize: "16px 16px, auto",
            })}
          />
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item>
              <Avatar
                src={user?.foto ? user.foto : undefined}
                alt={user ? `${user.ad || ""} ${user.soyad || ""}` : "profil-fotografi"}
                variant="rounded"
                sx={{
                  width: 128,
                  height: 128,
                  fontSize: "2.6rem",
                  border: "4px solid",
                  borderColor: "background.paper",
                  boxShadow: "0 10px 30px -12px rgba(15, 23, 27, 0.45)",
                  "& img, & .MuiAvatar-img": {
                    objectFit: "contain !important",
                  },
                }}
              >
                {!user?.foto && (
                  <Icon sx={{ fontSize: "110px !important", color: "#ced4da" }}>person</Icon>
                )}
              </Avatar>
            </Grid>

            <Grid item>
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center" flexWrap="wrap">
                  <Text variant="h5" fontWeight="bold" sx={{ mr: 1.5 }}>
                    {user ? `${user.ad || ""} ${user.soyad || ""}` : "Kullanıcı Bulunamadı"}
                  </Text>

                  <Box
                    display="flex"
                    alignItems="center"
                    pl={1.5}
                    sx={{ borderLeft: "2px solid", borderColor: "divider" }}
                  >
                    <Text
                      variant="subtitle1"
                      color="text"
                      fontWeight="medium"
                      onClick={() => {
                        if (userDeptUuid) {
                          navigate(`/records/department-details/${userDeptUuid}`);
                        } else {
                          const activeFiiliGorev =
                            user?.fiiliGorevler?.find((g) => g.aktif) || user?.fiiliGorevler?.[0];
                          const routeId =
                            activeFiiliGorev?.bolumId ||
                            activeFiiliGorev?.birimId ||
                            user?.bolumId ||
                            user?.birimId ||
                            user?.departmanId ||
                            user?.aktifCalismaYeri?.birimId ||
                            user?.aktifCalismaYeri?.masterBirimId;
                          if (routeId) {
                            navigate(`/records/department-details/${routeId}`);
                          }
                        }
                      }}
                      sx={{
                        cursor:
                          userDeptUuid ||
                          user?.fiiliGorevler?.length > 0 ||
                          user?.birimId ||
                          user?.bolumId ||
                          user?.departmanId ||
                          user?.aktifCalismaYeri?.birimId ||
                          user?.aktifCalismaYeri?.masterBirimId
                            ? "pointer"
                            : "default",
                        "&:hover": {
                          textDecoration:
                            userDeptUuid ||
                            user?.fiiliGorevler?.length > 0 ||
                            user?.birimId ||
                            user?.bolumId ||
                            user?.departmanId ||
                            user?.aktifCalismaYeri?.birimId ||
                            user?.aktifCalismaYeri?.masterBirimId
                              ? "underline"
                              : "none",
                        },
                      }}
                    >
                      {user?.bolumAdi ||
                        user?.fiiliGorevler?.find((g) => g.aktif)?.birimAd ||
                        user?.fiiliGorevler?.[0]?.birimAd ||
                        user?.birimAdi ||
                        user?.aktifCalismaYeri?.birimAd ||
                        user?.aktifCalismaYeri?.masterBirimAd ||
                        user?.personnelTree?.[0]?.name ||
                        "-"}
                    </Text>
                  </Box>
                </Box>

                <Box mt={0.5} display="flex" alignItems="center" flexWrap="wrap">
                  <Text variant="body2" color="text" fontWeight="medium">
                    {user?.unvan?.ad || user?.akademikUnvan?.ad || "Ünvan Belirtilmemiş"}
                  </Text>

                  {user?.jobrecordTipi && (
                    <Box ml={1.5}>
                      <Badge
                        variant="gradient"
                        color={
                          user.jobrecordTipi.toUpperCase() === "AKADEMIK"
                            ? "info"
                            : user.jobrecordTipi.toUpperCase() === "İDARI" ||
                                user.jobrecordTipi.toUpperCase() === "IDARI"
                              ? "secondary"
                              : "dark"
                        }
                        size="sm"
                        badgeContent={user.jobrecordTipi}
                        container
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md="auto" sx={{ ml: "auto" }}>
              <Box display="flex" alignItems="center" gap={4} flexWrap="wrap">
                <Box display="flex" alignItems="center">
                  <Icon fontSize="small" color="secondary" sx={{ mr: 1 }}>
                    email
                  </Icon>
                  <Text variant="body2" fontWeight="medium" color="text">
                    {user?.kurumEmail || "-"}
                  </Text>
                </Box>
                <Box display="flex" alignItems="center">
                  <Icon fontSize="small" color="secondary" sx={{ mr: 1 }}>
                    phone
                  </Icon>
                  <Text variant="body2" fontWeight="medium" color="text">
                    {user?.cepTel || "-"}
                  </Text>
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
                  onClick={() => handleSetTabValue(null, 0)}
                  sx={{
                    borderRadius: "md",
                    py: 1.5,
                    "&.Mui-selected": { backgroundColor: "transparent !important" },
                    "&.Mui-selected:hover": { backgroundColor: "rgba(0, 0, 0, 0.04) !important" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon color={tabValue === 0 ? "info" : "inherit"}>person</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Text
                        variant="subtitle2"
                        fontWeight="bold"
                        color={tabValue === 0 ? "info" : "text"}
                      >
                        Kullanıcı Bilgisi
                      </Text>
                    }
                  />
                </ListItemButton>
                <ListItemButton
                  selected={tabValue === 1}
                  onClick={() => handleSetTabValue(null, 1)}
                  sx={{
                    borderRadius: "md",
                    py: 1.5,
                    "&.Mui-selected": { backgroundColor: "transparent !important" },
                    "&.Mui-selected:hover": { backgroundColor: "rgba(0, 0, 0, 0)" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon color={tabValue === 1 ? "info" : "inherit"}>badge</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Text
                        variant="subtitle2"
                        fontWeight="bold"
                        color={tabValue === 1 ? "info" : "text"}
                      >
                        Görev/Kadro Bilgileri
                      </Text>
                    }
                  />
                </ListItemButton>

                <ListItemButton
                  selected={tabValue === 2}
                  onClick={() => handleSetTabValue(null, 2)}
                  sx={{
                    borderRadius: "md",
                    py: 1.5,
                    "&.Mui-selected": { backgroundColor: "transparent !important" },
                    "&.Mui-selected:hover": { backgroundColor: "rgba(0, 0, 0, 0.04) !important" },
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
                        Grup Bilgileri
                      </Text>
                    }
                  />
                </ListItemButton>
                <ListItemButton
                  selected={tabValue === 3}
                  onClick={() => handleSetTabValue(null, 3)}
                  sx={{
                    borderRadius: "md",
                    py: 1.5,
                    "&.Mui-selected": { backgroundColor: "transparent !important" },
                    "&.Mui-selected:hover": { backgroundColor: "rgba(0, 0, 0, 0)" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon color={tabValue === 3 ? "info" : "inherit"}>assignment</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Text
                        variant="subtitle2"
                        fontWeight="bold"
                        color={tabValue === 3 ? "info" : "text"}
                      >
                        Görev Bilgisi
                      </Text>
                    }
                  />
                  <Icon fontSize="small" color="secondary">
                    {taskMenuOpen ? "expand_less" : "expand_more"}
                  </Icon>
                </ListItemButton>
                <Collapse in={taskMenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton
                      selected={tabValue === 3 && taskTabValue === 0}
                      onClick={() => handleSetTaskSubTab(0)}
                      sx={{
                        pl: 6,
                        py: 1,
                        mb: 0.5,
                        borderRadius: "md",
                        "&.Mui-selected": { backgroundColor: "transparent !important" },
                        "&.Mui-selected:hover": { backgroundColor: "rgba(0, 0, 0, 0)" },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <Icon
                          fontSize="small"
                          color={tabValue === 3 && taskTabValue === 0 ? "info" : "inherit"}
                        >
                          account_balance
                        </Icon>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Text
                            variant="body2"
                            fontWeight="medium"
                            color={tabValue === 3 && taskTabValue === 0 ? "info" : "text"}
                          >
                            İdari Görev
                          </Text>
                        }
                      />
                    </ListItemButton>
                    <ListItemButton
                      selected={tabValue === 3 && taskTabValue === 1}
                      onClick={() => handleSetTaskSubTab(1)}
                      sx={{
                        pl: 6,
                        py: 1,
                        borderRadius: "md",
                        "&.Mui-selected": { backgroundColor: "transparent !important" },
                        "&.Mui-selected:hover": { backgroundColor: "rgba(0, 0, 0, 0)" },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <Icon
                          fontSize="small"
                          color={tabValue === 3 && taskTabValue === 1 ? "info" : "inherit"}
                        >
                          assignment_ind
                        </Icon>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Text
                            variant="body2"
                            fontWeight="medium"
                            color={tabValue === 3 && taskTabValue === 1 ? "info" : "text"}
                          >
                            Fiili Görev
                          </Text>
                        }
                      />
                    </ListItemButton>
                  </List>
                </Collapse>
                {user?.jobrecordTipi?.toUpperCase() === "AKADEMIK" && (
                  <ListItemButton
                    selected={tabValue === 4}
                    onClick={() => handleSetTabValue(null, 4)}
                    sx={{
                      borderRadius: "md",
                      py: 1.5,
                      mt: taskMenuOpen ? 1 : 0,
                      "&.Mui-selected": { backgroundColor: "transparent !important" },
                      "&.Mui-selected:hover": { backgroundColor: "rgba(0, 0, 0, 0)" },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Icon color={tabValue === 4 ? "info" : "inherit"}>school</Icon>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Text
                          variant="subtitle2"
                          fontWeight="bold"
                          color={tabValue === 4 ? "info" : "text"}
                        >
                          Akademisyen Bilgileri
                        </Text>
                      }
                    />
                  </ListItemButton>
                )}
                <ListItemButton
                  selected={tabValue === 5}
                  onClick={() => handleSetTabValue(null, 5)}
                  sx={{
                    borderRadius: "md",
                    py: 1.5,
                    mt: taskMenuOpen ? 1 : 0,
                    "&.Mui-selected": { backgroundColor: "transparent !important" },
                    "&.Mui-selected:hover": { backgroundColor: "rgba(0, 0, 0, 0)" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon color={tabValue === 5 ? "info" : "inherit"}>family_restroom</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Text
                        variant="subtitle2"
                        fontWeight="bold"
                        color={tabValue === 5 ? "info" : "text"}
                      >
                        Aile Bilgileri
                      </Text>
                    }
                  />
                </ListItemButton>
              </List>
            </Card>
          </Grid>
          <Grid item xs={12} md={8} xl={9}>
            {tabValue === 0 && (
              <PersonalInfoTab
                user={user}
                hierarchyTree={hierarchyTree}
                expandedOrgKeys={expandedOrgKeys}
                setExpandedOrgKeys={setExpandedOrgKeys}
                handleOrgSelect={handleOrgSelect}
                formatDateTR={formatDateTR}
                DetailItem={DetailItem}
              />
            )}
            {tabValue === 1 && (
              <DutyInfoTab
                user={user}
                orgPath={orgPath}
                formatDateTR={formatDateTR}
                userDeptUuid={userDeptUuid}
              />
            )}
            {tabValue === 2 && <GroupInfoTab />}
            {tabValue === 3 && (
              <TaskInfoTab
                user={user}
                taskTabValue={taskTabValue}
                handleAddIdariGorev={handleAddIdariGorev}
                handleAddFiiliGorev={handleAddFiiliGorev}
                formatDateTR={formatDateTR}
                DetailItem={DetailItem}
                handleEditIdariGorev={handleEditIdariGorev}
                handleDeleteIdariGorev={handleDeleteIdariGorev}
                handleEditFiiliGorev={handleEditFiiliGorev}
                handleDeleteFiiliGorev={handleDeleteFiiliGorev}
              />
            )}
            {tabValue === 4 && user?.jobrecordTipi?.toUpperCase() === "AKADEMIK" && (
              <AcademicInfoTab user={user} formatDateTR={formatDateTR} />
            )}
            {tabValue === 5 && <FamilyInfoTab user={user} formatDateTR={formatDateTR} />}
          </Grid>
        </Grid>
      </Box>
      <DeleteUserModal
        open={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        user={user}
        isLoading={isDeleting}
      />
      <EditPersonelModal
        open={isEditPersonelOpen}
        onClose={() => !isEditing && setIsEditPersonelOpen(false)}
        onConfirm={handleConfirmEdit}
        user={user}
        isLoading={isEditing}
      />
      <EditGuestModal
        open={isEditGuestOpen}
        onClose={() => !isEditing && setIsEditGuestOpen(false)}
        onConfirm={handleConfirmEdit}
        user={user}
        isLoading={isEditing}
      />
      <EditGroupModal
        open={isEditGroupOpen}
        onClose={() => !isEditing && setIsEditGroupOpen(false)}
        onConfirm={handleConfirmEdit}
        user={user}
        isLoading={isEditing}
      />
      <EditIdariGorevModal
        open={isEditIdariGorevOpen}
        onClose={() => {
          setIsEditIdariGorevOpen(false);
          setSelectedIdariGorevIndex(null);
        }}
        onConfirm={async (data) => {
          setIsEditing(true);
          try {
            const updatedIdariGorevler = [...(user.idariGorevler || [])];
            if (selectedIdariGorevIndex !== null) {
              updatedIdariGorevler[selectedIdariGorevIndex] = {
                ...updatedIdariGorevler[selectedIdariGorevIndex],
                ...data,
              };
            } else {
              updatedIdariGorevler.push(data);
            }
            setUser((prev) => ({ ...prev, idariGorevler: updatedIdariGorevler }));
            setIsEditIdariGorevOpen(false);
          } catch (err) {
            console.error("Hata oluştu", err);
          } finally {
            setIsEditing(false);
          }
        }}
        user={user}
        selectedIndex={selectedIdariGorevIndex}
        isLoading={isEditing}
      />
      <EditFiiliGorevModal
        open={isEditFiiliGorevOpen}
        onClose={() => {
          setIsEditFiiliGorevOpen(false);
          setSelectedFiiliGorevIndex(null);
        }}
        onConfirm={async (data) => {
          setIsEditing(true);
          try {
            const updatedFiiliGorevler = [...(user.fiiliGorevler || [])];
            if (selectedFiiliGorevIndex !== null) {
              updatedFiiliGorevler[selectedFiiliGorevIndex] = {
                ...updatedFiiliGorevler[selectedFiiliGorevIndex],
                ...data,
              };
            } else {
              updatedFiiliGorevler.push(data);
            }
            setUser((prev) => ({ ...prev, fiiliGorevler: updatedFiiliGorevler }));
            setIsEditFiiliGorevOpen(false);
          } catch (err) {
            console.error("Hata oluştu", err);
          } finally {
            setIsEditing(false);
          }
        }}
        user={user}
        selectedIndex={selectedFiiliGorevIndex}
        isLoading={isEditing}
      />
      <EditAcademicModal
        open={isEditAcademicOpen}
        onClose={() => !isEditing && setIsEditAcademicOpen(false)}
        onConfirm={handleConfirmEdit}
        user={user}
        isLoading={isEditing}
      />
    </Page>
  );
}
export default UserDetails;
