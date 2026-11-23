import { useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import { forwardRef } from "react";

import Box from "ui/Box";
import Text from "ui/Text";
import Button from "ui/Button";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function DeleteUserModal({ open, onClose, onConfirm, user, isLoading }) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="delete-user-title"
      aria-describedby="delete-user-description"
      PaperProps={{
        style: {
          borderRadius: "15px",
          padding: "10px",
        },
      }}
    >
      <DialogTitle id="delete-user-title">
        <Text variant="h5" fontWeight="medium" color="error">
          Kullanıcıyı Sil
        </Text>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <Text variant="body2" color="text">
            <strong>
              {user?.name} {user?.surname}
            </strong>{" "}
            isimli kullanıcıyı silmek istediğinize emin misiniz?
          </Text>
          <Text variant="button" color="secondary" fontWeight="regular">
            Bu işlem geri alınamaz ve kullanıcıya ait tüm veriler kalıcı olarak silinecektir.
          </Text>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: "24px" }}>
        <Button variant="outlined" color="secondary" onClick={onClose} disabled={isLoading}>
          İptal
        </Button>
        <Button variant="gradient" color="error" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Siliniyor..." : "Evet, Sil"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeleteUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  user: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default DeleteUserModal;
