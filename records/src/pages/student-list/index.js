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
import Input from "ui/Input";
import Pagination from "ui/Pagination";

import DataTable from "ui/DataTable";
import ControllerCard from "ui/ControllerCard";

const DEBOUNCE_MS = 400;

function StudentList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    kayitli: false,
    kayitsiz: false,
    yurt: false,
    disiplin: false,
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
    fetchStudents();
  }, [page, size, keyword, filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const trimmed = keyword.trim();

      let endpoint = "/api/v1/students";
      let params = {
        page: page > 0 ? page - 1 : 0,
        size: size,
      };

      const isAdvanced = Object.values(filters).some(Boolean) || trimmed.length >= 3;

      if (isAdvanced) {
        if (trimmed.length >= 3) {
          endpoint = "/api/v1/students/search";
          params.keyword = trimmed;
        } else {
          endpoint = "/api/v1/students/list";

          if (filters.kayitli) params.kayitlilik = "KAYITLI";
          if (filters.kayitsiz) params.kayitlilik = "KAYITSIZ";
          if (filters.yurt) params.yurtMu = true;
          if (filters.disiplin) params.disiplinCezasiVar = true;
        }
      }

      const response = await api.get(endpoint, { params });

      const mainContent = response.data.content || [];

      const detailedContent = await Promise.all(
        mainContent.map(async (student) => {
          if (student.bolumAdi || student.bolum?.name) {
            return {
              ...student,
              fetchedBolumName: student.bolumAdi || student.bolum?.name,
            };
          }

          try {
            const detailResponse = await api.get(`/api/v1/students/${student.id}`);
            const detailData =
              detailResponse.data?.data ||
              detailResponse.data?.content ||
              detailResponse.data ||
              {};

            return {
              ...student,
              fetchedBolumName: detailData.bolumAdi || detailData.bolum?.name || "-",
            };
          } catch (e) {
            return {
              ...student,
              fetchedBolumName: "-",
            };
          }
        })
      );

      setProfiles(detailedContent);
      setTotalPages(response.data.totalPages ?? 0);
      setTotalElements(response.data.totalElements ?? 0);
    } catch (error) {
      console.error("❌ BACKEND HATASI:", error.response?.data || error.message);
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
    ogrenciNo: p.ogrenciNo || p.studentNumber || "-",
    photoSrc: p.foto || p.photo || "",
    name: p.ad || "-",
    surname: p.soyad || "-",
    email: p.email || p.okulEmail || "-",
    bolum: p.fetchedBolumName || "-",
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

      if (["kayitli", "kayitsiz"].includes(key)) {
        if (prev[key]) {
          newFilters[key] = false;
        } else {
          newFilters.kayitli = false;
          newFilters.kayitsiz = false;
          newFilters[key] = true;
        }
      } else {
        newFilters[key] = !prev[key];
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
          sx={{
            cursor: "pointer",
            backgroundColor: ({ palette: { grey } }) => grey[200],
          }}
          onClick={() => navigate(`/records/student-details/${row.original.realId}`)}
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
      accessor: "name",
      width: "20%",
      align: "left",
      disableGlobalFilter: true,
      Cell: ({ row }) => (
        <Text
          variant="button"
          fontWeight="medium"
          color="text"
          sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
          onClick={() => navigate(`/records/student-details/${row.original.realId}`)}
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
      width: "15%",
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
          Öğrenci no
        </Text>
      ),
      accessor: "ogrenciNo",
      width: "15%",
      align: "left",
      disableGlobalFilter: true,
      Cell: ({ value }) => (
        <Text variant="button" fontWeight="regular" color="text">
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
      width: "20%",
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
          Bölüm
        </Text>
      ),
      accessor: "bolum",
      width: "20%",
      align: "left",
      disableGlobalFilter: true,
      Cell: ({ value }) => (
        <Text variant="button" fontWeight="regular" color="text">
          {value}
        </Text>
      ),
    },
  ];

  return (
    <Page>
      <PageHero
        tone="records"
        title="Öğrenciler"
        description="Kayıtlı öğrenciler. Kayıt durumuna, yurtta kalmaya ya da disiplin kaydına göre süzebilirsiniz."
        stats={[["Kayıt", loading ? "…" : totalElements, "school"]]}
      />
      <Box pb={3}>
        <Card>
          <Box mb={3} px={3} mt={3}>
            <Grid container spacing={2}>
              {[
                { key: "kayitli", title: "Kayıtlı Öğrenci", color: "info" },
                { key: "kayitsiz", title: "Kayıtsız Öğrenci", color: "secondary" },
                { key: "yurt", title: "Yurtta Kalanlar", color: "success" },
                { key: "disiplin", title: "Disiplin Cezası", color: "error" },
              ].map((item) => (
                <Grid item xs={12} sm={6} lg={3} key={item.key}>
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
              <Box display="flex" alignItems="center" width="100%">
                <Box sx={{ width: "22rem" }}>
                  <Input
                    placeholder="Öğrenci arayın (En az 3 karakter)..."
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

export default StudentList;
