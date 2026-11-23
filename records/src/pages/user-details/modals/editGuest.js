import { useState, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

import Box from "ui/Box";
import Text from "ui/Text";
import Button from "ui/Button";
import Input from "ui/Input";
import Select from "ui/Select";
import DatePicker from "ui/DatePicker";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function EditGuestModal({ open, onClose, onConfirm, user, isLoading }) {
  const [formData, setFormData] = useState({
    jobId: "",
    unvanAd: "",
    jobrecordTipi: "",
    jobrecordAlttipi: "",
    kurumSicilNo: "",
    jobrecordDurum: "",
    memuriyetBastar: "",
    activeJobName: "",
  });

  useEffect(() => {
    if (open && user) {
      setFormData({
        jobId: user.activeJob?.jobId || user.jobId || "",
        unvanAd: user.unvan?.ad || "",
        jobrecordTipi: user.jobrecordTipi || "",
        jobrecordAlttipi: user.jobrecordAlttipi || "",
        kurumSicilNo: user.kurumSicilNo || "",
        jobrecordDurum: user.jobrecordDurum || "",
        memuriyetBastar: user.memuriyetBastar || "",
        activeJobName: user.activeJob?.name || "",
      });
    }
  }, [open, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={!isLoading ? onClose : undefined}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "15px",
          padding: "16px",
        },
      }}
    >
      <DialogTitle>
        <Text variant="h5" fontWeight="medium">
          Görev / Kadro Bilgilerini Düzenle
        </Text>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Text variant="h6" fontWeight="medium" color="secondary" mt={1}>
                Görev Detayları
              </Text>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={1} ml={0.5}>
                <Text
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Görev ID
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="Örn. 12345"
                name="jobId"
                value={formData.jobId}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={1} ml={0.5}>
                <Text
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Görev Ünvanı
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="Örn. Bilgisayar İşletmeni"
                name="unvanAd"
                value={formData.unvanAd}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Text variant="h6" fontWeight="medium" color="secondary" mt={2}>
                Kadro Bilgileri
              </Text>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={1} ml={0.5}>
                <Text
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Kadro Türü
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="Örn. İdari Personel"
                name="jobrecordTipi"
                value={formData.jobrecordTipi}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={1} ml={0.5}>
                <Text
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Kadro Alt Türü
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="Örn. Kadrolu"
                name="jobrecordAlttipi"
                value={formData.jobrecordAlttipi}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={1} ml={0.5}>
                <Text
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Sicil No
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="Örn. 987654"
                name="kurumSicilNo"
                value={formData.kurumSicilNo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={1} ml={0.5}>
                <Text
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Kadro Durumu
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="Örn. Aktif"
                name="jobrecordDurum"
                value={formData.jobrecordDurum}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Text variant="h6" fontWeight="medium" color="secondary" mt={2}>
                Diğer Kurumsal Bilgiler
              </Text>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={1} ml={0.5}>
                <Text
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Göreve Başlama Tarihi
                </Text>
              </Box>
              <DatePicker
                value={formData.memuriyetBastar ? [formData.memuriyetBastar] : []}
                onChange={(date) => {
                  if (date && date.length > 0) {
                    const d = date[0];
                    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T12:00:00Z`;
                    handleChange({ target: { name: "memuriyetBastar", value: formatted } });
                  } else {
                    handleChange({ target: { name: "memuriyetBastar", value: "" } });
                  }
                }}
                options={{ allowInput: true }}
                input={{ placeholder: "GG-AA-YYYY", name: "memuriyetBastar" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={1} ml={0.5}>
                <Text
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Organizasyonel Konum (Birim)
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="Örn. Bilgi İşlem Daire Başkanlığı"
                name="activeJobName"
                value={formData.activeJobName}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: "24px" }}>
          <Button variant="outlined" color="secondary" onClick={onClose} disabled={isLoading}>
            İptal
          </Button>
          <Button type="submit" variant="gradient" color="info" disabled={isLoading}>
            {isLoading ? "Güncelleniyor..." : "Kaydet ve Güncelle"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

EditGuestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  user: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default EditGuestModal;
