// src/context/ModalContext.js
import React, { createContext, useContext, useState } from "react";
import { STORED_ENVIRONMENT_KEY } from "../constants";

// Create the context
const ModalContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [openRemovePopup, setOpenRemovePopup] = useState(false);
  const [openGenerateRoundPopup, setOpenGenerateRoundPopup] = useState(false);
  const [openNewCyclePopup, setOpenNewCyclePopup] = useState(false);
  const [openNewCoursePopup, setOpenNewCoursePopup] = useState(false);
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

  // Toggle new cycle popup
  const toggleNewCyclePopup = () => {
    setOpenNewCyclePopup(!openNewCyclePopup);
  };

  // Toggle new course popup
  const toggleNewCoursePopup = () => {
    setOpenNewCoursePopup(!openNewCoursePopup);
  };

  // Create value object
  const value = {
    openRemovePopup,
    openGenerateRoundPopup,
    openNewCyclePopup,
    openNewCoursePopup,
    toggleRemovePopup,
    toggleGenerateRoundPopup,
    toggleNewCyclePopup,
    toggleNewCoursePopup,
    isDevEnvironment,
    modal: {
      openRemovePopup,
      toggleRemovePopup,
      openGenerateRoundPopup,
      toggleGenerateRoundPopup,
      openNewCyclePopup,
      toggleNewCyclePopup,
      openNewCoursePopup,
      toggleNewCoursePopup,
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
