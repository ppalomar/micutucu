import React from "react";

import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useApp } from "../context";

const RemovePopup = ({ open, onRemove, message }) => {
  const { modal } = useApp();
  const { toggle } = modal;

  const handleCancel = () => {
    toggle();
  };

  const handleRemove = () => {
    onRemove();
    toggle();
  };

  return (
    <Modal
      open={open}
      onClose={toggle}
      aria-labelledby="remove-popup"
      aria-describedby="popup-to-confirm-remove-action"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.1)",
      }}
      disableBackdropClick
    >
      <div className="remove-popup">
        <Typography gutterBottom>{message}</Typography>
        <div>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleRemove}>
            Remove
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RemovePopup;
