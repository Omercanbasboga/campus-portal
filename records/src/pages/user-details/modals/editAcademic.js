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

function EditAcademicModal({ open, onClose, onConfirm, user, isLoading }) {
  const [formData, setFormData] = useState({
    orcid: "",
    scopusNo: "",
    yoksisArastirmaciNo: "",
    doktoraTarihi: "",
    docentTarihi: "",
    profesorTarihi: "",
    isDoktorali: false,
    yrddocTarihi: "",
    yrddocAtanmaTarihi: "",
    docentAtanmaTarihi: "",
    profesorAtanmaTarihi: "",
  });

  useEffect(() => {
    if (open && user) {
      setFormData({
        orcid: user.orcid || "",
        scopusNo: user.scopusNo || "",
        yoksisArastirmaciNo: user.yoksisArastirmaciNo || "",
        doktoraTarihi: user.doktoraTarihi || "",
        docentTarihi: user.docentTarihi || "",
        profesorTarihi: user.profesorTarihi || "",
        isDoktorali: user.isDoktorali || false,
        yrddocTarihi: user.yrddocTarihi || "",
        yrddocAtanmaTarihi: user.yrddocAtanmaTarihi || "",
        docentAtanmaTarihi: user.docentAtanmaTarihi || "",
        profesorAtanmaTarihi: user.profesorAtanmaTarihi || "",
      });
    }
  }, [open, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, isDoktorali: e.target.checked }));
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
          Akademik Bilgileri Düzenle
        </Text>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box mb={1} ml={0.5}>
                <Text component="label" variant="caption" fontWeight="bold">
                  Orcıd
                </Text>
              </Box>
              <Input
                type="text"
                name="orcid"
                value={formData.orcid}
                onChange={handleChange}
                placeholder="ORCID numarası girin"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box mb={1} ml={0.5}>
                <Text component="label" variant="caption" fontWeight="bold">
                  Scopus No
                </Text>
              </Box>
              <Input
                type="text"
                name="scopusNo"
                value={formData.scopusNo}
                onChange={handleChange}
                placeholder="Scopus numarası girin"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box mb={1} ml={0.5}>
                <Text component="label" variant="caption" fontWeight="bold">
                  Araştırmacı No (YÖKSİS)
                </Text>
              </Box>
              <Input
                type="text"
                name="yoksisArastirmaciNo"
                value={formData.yoksisArastirmaciNo}
                onChange={handleChange}
                placeholder="Araştırmacı numarası girin"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box mb={1} ml={0.5}>
                <Text component="label" variant="caption" fontWeight="bold">
                  Doktora Tarihi
                </Text>
              </Box>
              <DatePicker
                value={formData.doktoraTarihi ? [formData.doktoraTarihi] : []}
                onChange={(date) => {
                  if (date && date.length > 0) {
                    const d = date[0];
                    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T12:00:00Z`;
                    handleChange({ target: { name: "doktoraTarihi", value: formatted } });
                  } else {
                    handleChange({ target: { name: "doktoraTarihi", value: "" } });
                  }
                }}
                options={{ allowInput: true }}
                input={{ placeholder: "GG-AA-YYYY", name: "doktoraTarihi" }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box mb={1} ml={0.5}>
                <Text component="label" variant="caption" fontWeight="bold">
                  Doçentlik Tarihi
                </Text>
              </Box>
              <DatePicker
                value={formData.docentTarihi ? [formData.docentTarihi] : []}
                onChange={(date) => {
                  if (date && date.length > 0) {
                    const d = date[0];
                    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T12:00:00Z`;
                    handleChange({ target: { name: "docentTarihi", value: formatted } });
                  } else {
                    handleChange({ target: { name: "docentTarihi", value: "" } });
                  }
                }}
                options={{ allowInput: true }}
                input={{ placeholder: "GG-AA-YYYY", name: "docentTarihi" }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box mb={1} ml={0.5}>
                <Text component="label" variant="caption" fontWeight="bold">
                  Profesörlük Tarihi
                </Text>
              </Box>
              <DatePicker
                value={formData.profesorTarihi ? [formData.profesorTarihi] : []}
                onChange={(date) => {
                  if (date && date.length > 0) {
                    const d = date[0];
                    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T12:00:00Z`;
                    handleChange({ target: { name: "profesorTarihi", value: formatted } });
                  } else {
                    handleChange({ target: { name: "profesorTarihi", value: "" } });
                  }
                }}
                options={{ allowInput: true }}
                input={{ placeholder: "GG-AA-YYYY", name: "profesorTarihi" }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box mb={1} ml={0.5}>
                <Text component="label" variant="caption" fontWeight="bold">
                  Yrd. Doçentlik Tarihi
                </Text>
              </Box>
              <DatePicker
                value={formData.yrddocTarihi ? [formData.yrddocTarihi] : []}
                onChange={(date) => {
                  if (date && date.length > 0) {
                    const d = date[0];
                    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T12:00:00Z`;
                    handleChange({ target: { name: "yrddocTarihi", value: formatted } });
                  } else {
                    handleChange({ target: { name: "yrddocTarihi", value: "" } });
                  }
                }}
                options={{ allowInput: true }}
                input={{ placeholder: "GG-AA-YYYY", name: "yrddocTarihi" }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box mb={1} ml={0.5}>
                <Text component="label" variant="caption" fontWeight="bold">
                  Yrd. Doçentlik Atanma Tarihi
                </Text>
              </Box>
              <DatePicker
                value={formData.yrddocAtanmaTarihi ? [formData.yrddocAtanmaTarihi] : []}
                onChange={(date) => {
                  if (date && date.length > 0) {
                    const d = date[0];
                    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T12:00:00Z`;
                    handleChange({ target: { name: "yrddocAtanmaTarihi", value: formatted } });
                  } else {
                    handleChange({ target: { name: "yrddocAtanmaTarihi", value: "" } });
                  }
                }}
                options={{ allowInput: true }}
                input={{ placeholder: "GG-AA-YYYY", name: "yrddocAtanmaTarihi" }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box mb={1} ml={0.5}>
                <Text component="label" variant="caption" fontWeight="bold">
                  Doçentlik Atanma Tarihi
                </Text>
              </Box>
              <DatePicker
                value={formData.docentAtanmaTarihi ? [formData.docentAtanmaTarihi] : []}
                onChange={(date) => {
                  if (date && date.length > 0) {
                    const d = date[0];
                    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T12:00:00Z`;
                    handleChange({ target: { name: "docentAtanmaTarihi", value: formatted } });
                  } else {
                    handleChange({ target: { name: "docentAtanmaTarihi", value: "" } });
                  }
                }}
                options={{ allowInput: true }}
                input={{ placeholder: "GG-AA-YYYY", name: "docentAtanmaTarihi" }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box mb={1} ml={0.5}>
                <Text component="label" variant="caption" fontWeight="bold">
                  Profesörlük Atanma Tarihi
                </Text>
              </Box>
              <DatePicker
                value={formData.profesorAtanmaTarihi ? [formData.profesorAtanmaTarihi] : []}
                onChange={(date) => {
                  if (date && date.length > 0) {
                    const d = date[0];
                    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T12:00:00Z`;
                    handleChange({ target: { name: "profesorAtanmaTarihi", value: formatted } });
                  } else {
                    handleChange({ target: { name: "profesorAtanmaTarihi", value: "" } });
                  }
                }}
                options={{ allowInput: true }}
                input={{ placeholder: "GG-AA-YYYY", name: "profesorAtanmaTarihi" }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box mb={1} ml={0.5}>
                <Text component="label" variant="caption" fontWeight="bold">
                  Doktora Durumu
                </Text>
              </Box>
              <Box display="flex" alignItems="center" mt={0.5}>
                <Switch
                  checked={formData.isDoktorali}
                  onChange={handleSwitchChange}
                  name="isDoktorali"
                />
                <Text
                  variant="button"
                  fontWeight="regular"
                  ml={2}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSwitchChange({ target: { checked: !formData.isDoktorali } })}
                >
                  {formData.isDoktorali ? "Doktoralı" : "Doktoralı Değil"}
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

EditAcademicModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  user: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default EditAcademicModal;
