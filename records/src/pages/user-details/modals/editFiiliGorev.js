import { useState, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";

import Box from "ui/Box";
import Text from "ui/Text";
import Button from "ui/Button";
import Input from "ui/Input";
import DatePicker from "ui/DatePicker";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function EditFiiliGorevModal({ open, onClose, onConfirm, user, selectedIndex, isLoading }) {
  const [formData, setFormData] = useState({
    birimAd: "",
    masterBirimAd: "",
    baslangicTarihi: "",
    bitisTarihi: "",
    isAsil: true,
    is13b4: false,
  });

  useEffect(() => {
    if (open) {
      if (
        selectedIndex !== null &&
        user?.fiiliGorevler &&
        user.fiiliGorevler.length > selectedIndex
      ) {
        const fiiliGorev = user.fiiliGorevler[selectedIndex];
        setFormData({
          birimAd: fiiliGorev.birimAd || "",
          masterBirimAd: fiiliGorev.masterBirimAd || "",
          baslangicTarihi: fiiliGorev.baslangicTarihi || "",
          bitisTarihi: fiiliGorev.bitisTarihi || "",
          isAsil: fiiliGorev.isAsil !== undefined ? fiiliGorev.isAsil : true,
          is13b4: fiiliGorev.is13b4 !== undefined ? fiiliGorev.is13b4 : false,
        });
      } else {
        setFormData({
          birimAd: "",
          masterBirimAd: "",
          baslangicTarihi: "",
          bitisTarihi: "",
          isAsil: true,
          is13b4: false,
        });
      }
    }
  }, [open, user, selectedIndex]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name) => (e) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
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
          {selectedIndex !== null ? "Fiili Görev Bilgilerini Düzenle" : "Yeni Fiili Görev Ekle"}
        </Text>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box mb={1} ml={0.5}>
                <Text
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Birim
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="Örn. Bilgi İşlem Daire Başkanlığı"
                name="birimAd"
                value={formData.birimAd}
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
                  Master Birim
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="Örn. Rektörlük"
                name="masterBirimAd"
                value={formData.masterBirimAd}
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
                  Başlangıç Tarihi
                </Text>
              </Box>
              <DatePicker
                value={formData.baslangicTarihi ? [formData.baslangicTarihi] : []}
                onChange={(date) => {
                  if (date && date.length > 0) {
                    const d = date[0];
                    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T12:00:00Z`;
                    handleChange({ target: { name: "baslangicTarihi", value: formatted } });
                  } else {
                    handleChange({ target: { name: "baslangicTarihi", value: "" } });
                  }
                }}
                options={{ allowInput: true }}
                input={{ placeholder: "GG-AA-YYYY", name: "baslangicTarihi" }}
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
                  Bitiş Tarihi
                </Text>
              </Box>
              <DatePicker
                value={formData.bitisTarihi ? [formData.bitisTarihi] : []}
                onChange={(date) => {
                  if (date && date.length > 0) {
                    const d = date[0];
                    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T12:00:00Z`;
                    handleChange({ target: { name: "bitisTarihi", value: formatted } });
                  } else {
                    handleChange({ target: { name: "bitisTarihi", value: "" } });
                  }
                }}
                options={{ allowInput: true }}
                input={{ placeholder: "GG-AA-YYYY", name: "bitisTarihi" }}
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
                  Asil mi?
                </Text>
              </Box>
              <Box display="flex" alignItems="center" mt={0.5}>
                <Switch checked={formData.isAsil} onChange={handleSwitchChange("isAsil")} />
                <Text
                  variant="button"
                  fontWeight="regular"
                  ml={2}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() =>
                    handleSwitchChange("isAsil")({ target: { checked: !formData.isAsil } })
                  }
                >
                  {formData.isAsil ? "Evet" : "Hayır"}
                </Text>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mb={1} ml={0.5}>
                <Text
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  13b/4 Görevlendirmesi mi?
                </Text>
              </Box>
              <Box display="flex" alignItems="center" mt={0.5}>
                <Switch checked={formData.is13b4} onChange={handleSwitchChange("is13b4")} />
                <Text
                  variant="button"
                  fontWeight="regular"
                  ml={2}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() =>
                    handleSwitchChange("is13b4")({ target: { checked: !formData.is13b4 } })
                  }
                >
                  {formData.is13b4 ? "Evet" : "Hayır"}
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

EditFiiliGorevModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  user: PropTypes.object,
  selectedIndex: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default EditFiiliGorevModal;
