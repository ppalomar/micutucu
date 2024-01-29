import React from "react";

import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useApp } from "../context";

const GenerateRoundPopup = ({ open, generateRoundHandler, message }) => {
  const { modal } = useApp();
  const { toggleGenerateRoundPopup } = modal;

  const handleCancel = () => {
    toggleGenerateRoundPopup();
  };

  const handleGenerateRound = () => {
    generateRoundHandler();
    toggleGenerateRoundPopup();
  };

  return (
    <Modal
      open={open}
      onClose={toggleGenerateRoundPopup}
      aria-labelledby="generate-round-popup"
      aria-describedby="popup-to-confirm-generate-round-action"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.1)",
      }}
      disableBackdropClick
    >
      <div className="popup generate-round-popup">
        <Typography gutterBottom>{message}</Typography>
        <div>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleGenerateRound}>
            Generate Round
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GenerateRoundPopup;
