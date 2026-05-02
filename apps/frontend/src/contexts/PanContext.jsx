import React, { createContext, useContext, useState } from "react";

const PanContext = createContext(null);

export const PanProvider = ({ children }) => {
  const [panData, setPanData] = useState(null);
  return (
    <PanContext.Provider value={{ panData, setPanData }}>
      {children}
    </PanContext.Provider>
  );
};

export const usePanContext = () => {
  const ctx = useContext(PanContext);
  if (!ctx) {
    throw new Error("usePanContext must be used within PanProvider");
  }
  return ctx;
};

export default PanContext;
