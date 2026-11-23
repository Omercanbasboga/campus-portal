import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "api/client";

import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";

import Box from "ui/Box";
import Page from "ui/Page";
import PageHero from "ui/PageHero";
import Text from "ui/Text";
import Avatar from "ui/Avatar";
import Badge from "ui/Badge";
import Input from "ui/Input";
import Pagination from "ui/Pagination";

import DataTable from "ui/DataTable";
import ControllerCard from "ui/ControllerCard";

const DEBOUNCE_MS = 400;

function UserList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    akademik: false,
    idari: false,
    diger: false,
    emekli: false,
    istifa: false,
  });

  const [keyword, setKeyword] = useState("");

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const debounceTimer = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, [page, size, keyword, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const trimmed = keyword.trim();

      let endpoint = "/api/v1/personel/aktif";
      let params = {
        page: page > 0 ? page - 1 : 0,
        size: size,
      };

      const isAdvanced = Object.values(filters).some(Boolean) || trimmed.length >= 3;

      if (isAdvanced) {
        endpoint = "/api/v1/personel/list";

        if (trimmed.length >= 3) {
          params.search = trimmed;
        }

        let jobTypes = [];
        if (filters.akademik) jobTypes.push("AKADEMIK");
        if (filters.idari) jobTypes.push("IDARI");
        if (filters.diger) jobTypes.push("DIGER_PERSONEL");

        if (jobTypes.length > 0) {
          params.jobrecordTipi = jobTypes.join(",");
        }

        if (filters.emekli) params.emekliMi = true;
        if (filters.istifa) params.ayrilmaTipi = "ISTIFA";

        if (filters.emekli || filters.istifa) {
          params.isActive = false;
        } else if (jobTypes.length > 0 && !filters.emekli && !filters.istifa) {
          params.isActive = true;
        }
      }

      const response = await api.get(endpoint, { params });

      const mainContent = response.data.content || [];

      const detailedContent = await Promise.all(
        mainContent.map(async (user) => {
          try {
            const detailResponse = await api.get(`/api/v1/personel/${user.id}`);
            const detailData =
              detailResponse.data?.data ||
              detailResponse.data?.content ||
              detailResponse.data ||
              {};

            return {
              ...user,
              fetchedBolumName:
                detailData.birim?.name ||
                detailData.personnelTree?.[0]?.name ||
                detailData.aktifCalismaYeri?.birimAd ||
                "-",
            };
          } catch (e) {
            return { ...user, fetchedBolumName: "-" };
          }
        })
      );

      setProfiles(detailedContent);
      setTotalPages(response.data.totalPages ?? 0);
      setTotalElements(response.data.totalElements ?? 0);
    } catch (error) {
      console.error("❌ BACKEND HATASI:", error);
      setProfiles([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const rows = profiles.map((p, index) => ({
    id: p.id ? `${p.id}-${index}` : `no-id-${index}`,
    realId: p.id,
    photoSrc: p.foto || p.photo || "",
    name: p.ad || p.name || "-",
    surname: p.soyad || p.surname || "-",
    email: p.kurumEmail || p.email || "-",
    searchableNameAndEmail: `${p.ad || p.name || ""} ${p.soyad || p.surname || ""}`,
    department:
      p.fetchedBolumName && p.fetchedBolumName !== "-"
        ? p.fetchedBolumName
        : p.birimAdi || p.department || "-",
    typeLabel: p.jobrecordTipi || p.type || "-",
    typeColor: p.jobrecordTipi === "Akademik" || p.type === "Akademik" ? "info" : "secondary",
  }));

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setPage(1);
      setKeyword(value);
    }, DEBOUNCE_MS);
  };

  const handlePageChange = (newPage) => setPage(newPage + 1);

  const handlePageSizeChange = (newSize) => {
    setSize(newSize);
    setPage(1);
  };

  const handleFilterToggle = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      if (["akademik", "idari", "diger"].includes(key)) {
        if (prev[key]) {
          newFilters[key] = false;
        } else {
          newFilters.akademik = false;
          newFilters.idari = false;
          newFilters.diger = false;
          newFilters[key] = true;
        }
      }

      if (["emekli", "istifa"].includes(key)) {
        if (prev[key]) {
          newFilters[key] = false;
        } else {
          newFilters.emekli = false;
          newFilters.istifa = false;
          newFilters[key] = true;
        }
      }

      return newFilters;
    });
    setPage(1);
  };

  const columns = [
    {
      Header: (
        <Text variant="caption" fontWeight="bold" color="dark" sx={{ opacity: 1 }}>
          Fotoğraf
        </Text>
      ),
      accessor: "photoSrc",
      width: "10%",
      align: "center",
      disableSortBy: true,
      disableGlobalFilter: true,
      Cell: ({ row }) => (
        <Avatar
          src={row.original.photoSrc || ""}
          alt={row.original.name}
          size="sm"
          variant="rounded"
          sx={{ cursor: "pointer", backgroundColor: ({ palette: { grey } }) => grey[200] }}
          onClick={() => navigate(`/records/user-details/${row.original.realId}`)}
        >
          <Icon sx={{ color: ({ palette: { grey } }) => grey[500], fontSize: "1.5rem !important" }}>
            person
          </Icon>
        </Avatar>
      ),
    },
    {
      Header: (
        <Text variant="caption" fontWeight="bold" color="dark" sx={{ opacity: 1 }}>
          Ad
        </Text>
      ),
      accessor: "searchableNameAndEmail",
      width: "18%",
      align: "left",
      Cell: ({ row }) => (
        <Text
          variant="button"
          fontWeight="medium"
          color="text"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(`/records/user-details/${row.original.realId}`)}
        >
          {row.original.name}
        </Text>
      ),
    },
    {
      Header: (
        <Text variant="caption" fontWeight="bold" color="dark" sx={{ opacity: 1 }}>
          Soyad
        </Text>
      ),
      accessor: "surname",
      width: "18%",
      align: "left",
      disableGlobalFilter: true,
      Cell: ({ value }) => (
        <Text variant="button" fontWeight="regular" color="secondary">
          {value}
        </Text>
      ),
    },
    {
      Header: (
        <Text variant="caption" fontWeight="bold" color="dark" sx={{ opacity: 1 }}>
          E-posta
        </Text>
      ),
      accessor: "email",
      width: "22%",
      align: "left",
      disableGlobalFilter: true,
      Cell: ({ value }) => (
        <Text variant="button" fontWeight="regular" color="text">
          {value || "-"}
        </Text>
      ),
    },
    {
      Header: (
        <Text variant="caption" fontWeight="bold" color="dark" sx={{ opacity: 1 }}>
          Birim
        </Text>
      ),
      accessor: "department",
      width: "20%",
      align: "left",
      disableGlobalFilter: true,
      Cell: ({ value, row }) => (
        <Badge
          variant="gradient"
          badgeContent={value}
          color={row.original.typeColor || "secondary"}
          size="xs"
          container
        />
      ),
    },
    {
      Header: (
        <Text variant="caption" fontWeight="bold" color="dark" sx={{ opacity: 1 }}>
          Tipi
        </Text>
      ),
      accessor: "typeLabel",
      width: "12%",
      align: "center",
      disableGlobalFilter: true,
      Cell: ({ value }) => (
        <Text variant="caption" color="secondary" fontWeight="medium">
          {value}
        </Text>
      ),
    },
  ];

  return (
    <Page>
      <PageHero
        tone="records"
        title="Personel"
        description="Kurumdaki tüm çalışanlar. Kadro tipine göre süzebilir, ada ya da e-postaya göre arayabilirsiniz."
        stats={[["Kayıt", loading ? "…" : totalElements, "badge"]]}
      />
      <Box pb={3}>
        <Card>
          <Box mb={3} mt={3} px={3}>
            <Grid container spacing={2}>
              {[
                { key: "akademik", title: "Akademik", color: "info" },
                { key: "idari", title: "İdari", color: "info" },
                { key: "diger", title: "Diğer Personel", color: "info" },
                { key: "emekli", title: "Emekli", color: "dark" },
                { key: "istifa", title: "İstifa", color: "error" },
              ].map((item) => (
                <Grid item xs={12} sm={6} lg={2.4} key={item.key}>
                  <Box
                    onClick={() => handleFilterToggle(item.key)}
                    sx={{ cursor: "pointer", height: "100%" }}
                  >
                    <ControllerCard
                      color={item.color}
                      state={filters[item.key]}
                      title={item.title}
                      onChange={() => {}}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 15px",
                        height: "auto",
                        minHeight: "60px",
                        pointerEvents: "none",
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <DataTable
            table={{ columns, rows }}
            canSearch={false}
            isSorted={false}
            showTotalEntries
            manualPagination
            pageCount={totalPages}
            onPageChange={handlePageChange}
            onEntriesChange={handlePageSizeChange}
            currentPage={page - 1}
            totalElements={totalElements}
            entriesPerPage={{ defaultValue: size, entries: [5, 10, 25, 50] }}
            pagination={{ variant: "gradient", color: "info" }}
            filterNodeLeft={null}
            filterNode={
              <Box display="flex" alignItems="center" width="100%" gap={4}>
                <Box sx={{ width: "22rem" }}>
                  <Input
                    placeholder="Ad, soyad veya e-posta... (En az 3 karakter)"
                    onChange={handleKeywordChange}
                    icon={{ component: "search", direction: "left" }}
                  />
                </Box>
              </Box>
            }
            paginationNode={
              <Pagination variant="gradient" color="info" size="small">
                <Pagination
                  item
                  disabled={loading || page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <Icon>keyboard_arrow_left</Icon>
                </Pagination>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                  .map((pageNumber) => (
                    <Pagination
                      key={pageNumber}
                      item
                      active={pageNumber === page}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination>
                  ))}
                <Pagination
                  item
                  disabled={loading || page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <Icon>keyboard_arrow_right</Icon>
                </Pagination>
              </Pagination>
            }
          />
        </Card>
      </Box>
    </Page>
  );
}

export default UserList;
