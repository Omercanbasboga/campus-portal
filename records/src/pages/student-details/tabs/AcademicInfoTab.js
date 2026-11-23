import React from "react";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

import Box from "ui/Box";
import Text from "ui/Text";

export default function AcademicInfoTab({ student, DetailItem }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: "100%" }}>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Text variant="h5" fontWeight="medium">
            Akademik Bilgiler
          </Text>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DetailItem icon="tag" label="Öğrenci No" value={student?.studentNumber} />
            <DetailItem icon="account_balance" label="Fakülte" value={student?.fakulte?.name} />
            <DetailItem
              icon="school"
              label="Bölüm"
              value={
                student?.bolum?.id ? (
                  <span
                    style={{ cursor: "pointer", color: "#17c1e8", fontWeight: "bold" }}
                    onClick={() => navigate(`/records/department-details/${student.bolum.id}`)}
                  >
                    {student?.bolum?.name}
                  </span>
                ) : (
                  student?.bolum?.name
                )
              }
            />
            <DetailItem icon="category" label="Bölüm Tipi" value={student?.bolumTip} />
            <DetailItem icon="gavel" label="Statü" value={student?.statu} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DetailItem
              icon="assignment_ind"
              label="Kayıtlılık Durumu"
              value={student?.kayitlilik}
            />
            <DetailItem icon="info" label="Durumu" value={student?.durumu} />
            <DetailItem icon="grading" label="GPA" value={student?.gpa} />
            <DetailItem icon="hotel_class" label="Sertifika" value={student?.sertifika} />
            <DetailItem icon="work_history" label="Dönem Durumu" value={student?.donemDurumu} />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Text variant="subtitle2" fontWeight="bold" color="text">
              Giriş & Geçmiş Bilgileri
            </Text>
          </Grid>

          <Grid item xs={12} sm={6}>
            <DetailItem icon="login" label="Giriş Tipi" value={student?.girisTipi} />
            <DetailItem icon="event" label="Kayıt Tarihi" value={student?.kayitTarihi} />
            <DetailItem icon="input" label="Üniversite Giriş" value={student?.universiteGiris} />
            <DetailItem icon="input" label="Bölüm Giriş" value={student?.bolumEgiris} />
            <DetailItem
              icon="assessment"
              label="Yerleşme Puan Türü"
              value={student?.yerlesilePuanTuru}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DetailItem
              icon="functions"
              label="Yerleşme Puanı"
              value={student?.yerKullanilanPuani}
            />
            <DetailItem
              icon="leaderboard"
              label="Başarı Sırası"
              value={student?.yerKullanilanBasariSirasi}
            />
            <DetailItem
              icon="format_list_numbered"
              label="Tercih Sırası"
              value={student?.tercihSirasi}
            />
            <DetailItem
              icon="warning"
              label="Disiplin Cezası"
              value={student?.disiplinCezasiVar ? "Var" : "Yok"}
              iconColor="error"
              labelColor={student?.disiplinCezasiVar ? "error" : "secondary"}
              valueColor={student?.disiplinCezasiVar ? "error" : "text"}
            />
            <DetailItem icon="timeline" label="Toplam Dönem" value={student?.toplamDonem} />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}
