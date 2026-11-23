import { useState, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";

import Box from "ui/Box";
import Text from "ui/Text";
import Button from "ui/Button";
import Input from "ui/Input";
import Select from "ui/Select";
import DatePicker from "ui/DatePicker";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const cinsiyetOptions = [
  { value: "Erkek", label: "Erkek" },
  { value: "Kadın", label: "Kadın" },
];

function EditPersonelModal({ open, onClose, onConfirm, user, isLoading }) {
  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    kurumEmail: "",
    cepTel: "",
    tckno: "",
    dogumTarihi: "",
    cinsiyet: "",
    isActive: true,
  });

  useEffect(() => {
    if (open && user) {
      setFormData({
        ad: user.ad || "",
        soyad: user.soyad || "",
        kurumEmail: user.kurumEmail || "",
        cepTel: user.cepTel || "",
        tckno: user.tckno || user.tckimlikno || user.tckn || "",
        dogumTarihi: user.dogumTarihi || "",
        cinsiyet: user.cinsiyet || "",
        isActive: user.isActive !== undefined ? user.isActive : true,
      });
    }
  }, [open, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const handleCinsiyetChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, cinsiyet: selectedOption?.value || "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

  const currentCinsiyetOption = cinsiyetOptions.find((o) => o.value === formData.cinsiyet) || null;

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
          Personel Bilgilerini Düzenle
        </Text>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Text variant="h6" fontWeight="medium" color="secondary" mt={1}>
                Kişisel Bilgiler
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
                  Ad
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="Örn. Mehmet Naci"
                name="ad"
                value={formData.ad}
                onChange={handleChange}
                required
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
                  Soyad
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="Örn. İnci"
                name="soyad"
                value={formData.soyad}
                onChange={handleChange}
                required
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
                  E-posta
                </Text>
              </Box>
              <Input
                type="email"
                placeholder="ornek@ornek.edu.tr"
                name="kurumEmail"
                value={formData.kurumEmail}
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
                  Telefon No
                </Text>
              </Box>
              <Input
                type="tel"
                placeholder="Örn. 0555 555 5555"
                name="cepTel"
                value={formData.cepTel}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Text variant="h6" fontWeight="medium" color="secondary" mt={2}>
                Kimlik Bilgileri
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
                  TC Kimlik No
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="11 haneli TC No"
                name="tckno"
                value={formData.tckno}
                onChange={handleChange}
                inputProps={{ maxLength: 11 }}
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
                  Doğum Tarihi
                </Text>
              </Box>
              <DatePicker
                value={formData.dogumTarihi ? [formData.dogumTarihi] : []}
                onChange={(date) => {
                  if (date && date.length > 0) {
                    const d = date[0];
                    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T12:00:00Z`;
                    handleChange({ target: { name: "dogumTarihi", value: formatted } });
                  } else {
                    handleChange({ target: { name: "dogumTarihi", value: "" } });
                  }
                }}
                options={{ allowInput: true }}
                input={{ placeholder: "GG-AA-YYYY", name: "dogumTarihi" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ position: "relative", zIndex: 12 }}>
              <Box mb={1} ml={0.5}>
                <Text
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Cinsiyet
                </Text>
              </Box>
              <Select
                options={cinsiyetOptions}
                value={currentCinsiyetOption}
                onChange={handleCinsiyetChange}
                placeholder="Cinsiyet Seçin..."
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
                  Durum (Aktif/Pasif)
                </Text>
              </Box>
              <Box display="flex" alignItems="center" mt={0.5}>
                <Switch checked={formData.isActive} onChange={handleSwitchChange} />
                <Text
                  variant="button"
                  fontWeight="regular"
                  ml={2}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSwitchChange({ target: { checked: !formData.isActive } })}
                >
                  {formData.isActive ? "Aktif" : "Pasif"}
                </Text>
              </Box>
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

EditPersonelModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  user: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default EditPersonelModal;
