import React, { createContext, useContext, useState } from "react";

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

export const useApp = () => {
  return useContext(AppContext);
};
