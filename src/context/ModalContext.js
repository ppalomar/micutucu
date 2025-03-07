// src/context/ModalContext.js
import React, { createContext, useContext, useState } from "react";
import { STORED_ENVIRONMENT_KEY } from "../constants";

// Create the context
const ModalContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [openRemovePopup, setOpenRemovePopup] = useState(false);
  const [openGenerateRoundPopup, setOpenGenerateRoundPopup] = useState(false);
  const [isDevEnvironment] = useState(
    localStorage.getItem(STORED_ENVIRONMENT_KEY) === "DEV"
  );

  // Toggle remove popup
  const toggleRemovePopup = () => {
    setOpenRemovePopup(!openRemovePopup);
  };

  // Toggle generate round popup
  const toggleGenerateRoundPopup = () => {
    setOpenGenerateRoundPopup(!openGenerateRoundPopup);
  };

  // Create value object
  const value = {
    openRemovePopup,
    openGenerateRoundPopup,
    toggleRemovePopup,
    toggleGenerateRoundPopup,
    isDevEnvironment,
    modal: {
      openRemovePopup,
      toggleRemovePopup,
      openGenerateRoundPopup,
      toggleGenerateRoundPopup,
    },
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

// Custom hook to use the modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within an AppProvider");
  }
  return context;
};
