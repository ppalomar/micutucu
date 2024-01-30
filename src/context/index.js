import React, { createContext, useContext, useState } from "react";

import { STORED_ENVIRONMENT_KEY } from "../constants";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [openRemovePopup, setOpenRemovePopup] = useState(false);
  const [openGenerateRoundPopup, setOpenGenerateRoundPopup] = useState(false);

  const toggleRemovePopup = () => {
    setOpenRemovePopup(!openRemovePopup);
  };

  const toggleGenerateRoundPopup = () => {
    setOpenGenerateRoundPopup(!openGenerateRoundPopup);
  };

  const initialState = {
    isDevEnvironment: localStorage.getItem(STORED_ENVIRONMENT_KEY) === "DEV",
    modal: {
      openRemovePopup,
      toggleRemovePopup,
      openGenerateRoundPopup,
      toggleGenerateRoundPopup,
    },
  };

  return (
    <AppContext.Provider value={initialState}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
