import React from "react";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Box from "ui/Box";
import Text from "ui/Text";
import Button from "ui/Button";
import Avatar from "ui/Avatar";

export default function StudentListTab({
  studentList,
  studentLoading,
  studentPage,
  setStudentPage,
  studentSize,
  setStudentSize,
  studentTotalPages,
}) {
  const navigate = useNavigate();

  return (
    <Card>
      <Box
        px={3}
        py={{ xs: 1, lg: 2 }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
        borderBottom="1px solid rgba(0,0,0,0.08)"
      >
        <Text variant="h5" fontWeight="medium">
          Öğrenci Listesi
          {studentList.length > 0 && (
            <Text component="span" variant="body2" color="secondary" ml={1}>
              (Sayfa {studentPage + 1} / {studentTotalPages})
            </Text>
          )}
        </Text>
      </Box>

      <Box px={3} pb={2}>
        {studentLoading ? (
          <Box py={4} textAlign="center">
            <Text variant="body1" color="text">
              Yükleniyor...
            </Text>
          </Box>
        ) : studentList.length > 0 ? (
          <List disablePadding>
            {studentList.map((student, index, array) => (
              <div key={student.id || index}>
                <ListItem
                  sx={{
                    py: { xs: 0.5, lg: 1.5 },
                    px: 0,
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                  }}
                  onClick={() => navigate(`/records/student-details/${student.id}`)}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Avatar
                      src={student.foto || ""}
                      alt={student.ad}
                      size="md"
                      variant="rounded"
                      sx={{ bgcolor: ({ palette: { grey } }) => grey[200] }}
                    >
                      <Icon fontSize="medium" sx={{ color: ({ palette: { grey } }) => grey[500] }}>
                        school
                      </Icon>
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Text variant="subtitle2" fontWeight="bold" color="text">
                        {student.ad} {student.soyad}
                      </Text>
                    }
                    secondary={
                      <Text variant="body2" color="secondary">
                        No: {student.ogrenciNo || "-"}
                        {student.email ? ` · ${student.email}` : ""}
                      </Text>
                    }
                  />
                </ListItem>
                {index < array.length - 1 && <Divider sx={{ m: 0 }} />}
              </div>
            ))}
          </List>
        ) : (
          <Box py={4} textAlign="center">
            <Icon fontSize="large" color="secondary" sx={{ opacity: 0.4 }}>
              school
            </Icon>
            <Text variant="body1" color="text" mt={1}>
              Öğrenci verisi bulunmamaktadır.
            </Text>
          </Box>
        )}
      </Box>

      {studentTotalPages > 1 && (
        <Box
          px={3}
          py={{ xs: 1, lg: 1.5 }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderTop="1px solid rgba(0,0,0,0.08)"
        >
          <Box display="flex" alignItems="center" gap={0.5}>
            {[5, 10, 20].map((n) => (
              <Button
                key={n}
                variant={studentSize === n ? "gradient" : "text"}
                color={studentSize === n ? "info" : "secondary"}
                size="sm"
                sx={{ minWidth: 32, px: 0.5 }}
                onClick={() => {
                  setStudentSize(n);
                  setStudentPage(0);
                }}
              >
                {n}
              </Button>
            ))}
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Button
              variant="text"
              color="secondary"
              size="sm"
              disabled={studentPage === 0}
              onClick={() => setStudentPage((p) => Math.max(0, p - 1))}
              sx={{ minWidth: 32, px: 0.5 }}
            >
              <Icon fontSize="medium">navigate_before</Icon>
            </Button>
            <Text variant="body2" color="text" fontWeight="medium" sx={{ whiteSpace: "nowrap" }}>
              {studentPage + 1} / {studentTotalPages}
            </Text>
            <Button
              variant="text"
              color="secondary"
              size="sm"
              disabled={studentPage >= studentTotalPages - 1}
              onClick={() => setStudentPage((p) => p + 1)}
              sx={{ minWidth: 32, px: 0.5 }}
            >
              <Icon fontSize="medium">navigate_next</Icon>
            </Button>
          </Box>
        </Box>
      )}
    </Card>
  );
}
