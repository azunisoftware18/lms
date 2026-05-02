import React, { createContext, useContext, useState } from "react";

const AadhaarContext = createContext(null);

export const AadhaarProvider = ({ children }) => {
  const [aadhaarData, setAadhaarData] = useState(null);
  return (
    <AadhaarContext.Provider value={{ aadhaarData, setAadhaarData }}>
      {children}
    </AadhaarContext.Provider>
  );
};

export const useAadhaarContext = () => {
  const ctx = useContext(AadhaarContext);
  if (!ctx) {
    throw new Error("useAadhaarContext must be used within AadhaarProvider");
  }
  return ctx;
};

export default AadhaarContext;
