import { useState, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Grid";

import Box from "ui/Box";
import Text from "ui/Text";
import Button from "ui/Button";
import Input from "ui/Input";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function EditGroupModal({ open, onClose, onConfirm, user, isLoading }) {
  const [formData, setFormData] = useState({
    groupInfo: "",
  });

  useEffect(() => {
    if (open && user) {
      setFormData({
        groupInfo: user.groupInfo || "",
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
      maxWidth="sm"
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
          Grup Bilgilerini Düzenle
        </Text>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box mb={1} ml={0.5}>
                <Text
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  Grup Notları
                </Text>
              </Box>
              <Input
                multiline
                rows={6}
                name="groupInfo"
                value={formData.groupInfo}
                onChange={handleChange}
                placeholder="Grup üyelikleri ve rol detaylarını buraya girin..."
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

EditGroupModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  user: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default EditGroupModal;
