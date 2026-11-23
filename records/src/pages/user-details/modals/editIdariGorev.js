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

function EditIdariGorevModal({ open, onClose, onConfirm, user, selectedIndex, isLoading }) {
  const [formData, setFormData] = useState({
    unvanAd: "",
    unvanSeviye: "",
    birimAd: "",
    baslangicTarihi: "",
    bitisTarihi: "",
    isVekaleten: false,
  });

  useEffect(() => {
    if (open) {
      if (
        selectedIndex !== null &&
        user?.idariGorevler &&
        user.idariGorevler.length > selectedIndex
      ) {
        const idariGorev = user.idariGorevler[selectedIndex];
        setFormData({
          unvanAd: idariGorev.unvanAd || "",
          unvanSeviye: idariGorev.unvanSeviye || "",
          birimAd: idariGorev.birimAd || "",
          baslangicTarihi: idariGorev.baslangicTarihi || idariGorev.idarigorevBastar || "",
          bitisTarihi: idariGorev.bitisTarihi || idariGorev.idarigorevBittar || "",
          isVekaleten: idariGorev.isVekaleten || idariGorev.idarigorevIsvekaleten || false,
        });
      } else {
        setFormData({
          unvanAd: "",
          unvanSeviye: "",
          birimAd: "",
          baslangicTarihi: "",
          bitisTarihi: "",
          isVekaleten: false,
        });
      }
    }
  }, [open, user, selectedIndex]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, isVekaleten: e.target.checked }));
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
          {selectedIndex !== null ? "İdari Görev Bilgilerini Düzenle" : "Yeni İdari Görev Ekle"}
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
                  Unvan
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="Örn. Dekan"
                name="unvanAd"
                value={formData.unvanAd}
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
                  Unvan Seviye
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="Örn. 1, 2, 3"
                name="unvanSeviye"
                value={formData.unvanSeviye}
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
                  Birim
                </Text>
              </Box>
              <Input
                type="text"
                placeholder="Örn. Mühendislik Fakültesi"
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
                  Vekaleten mi?
                </Text>
              </Box>
              <Box display="flex" alignItems="center" mt={0.5}>
                <Switch
                  checked={formData.isVekaleten}
                  onChange={handleSwitchChange}
                  name="isVekaleten"
                />
                <Text
                  variant="button"
                  fontWeight="regular"
                  ml={2}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSwitchChange({ target: { checked: !formData.isVekaleten } })}
                >
                  {formData.isVekaleten ? "Evet" : "Hayır"}
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

EditIdariGorevModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  user: PropTypes.object,
  selectedIndex: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default EditIdariGorevModal;
