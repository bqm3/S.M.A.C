import React, { createContext, useEffect, useState, useContext } from "react";
export const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const [step, setStep] = useState(1);

  const saveStep = (data) => {
    setStep(data);
  };

  return (
    <ScanContext.Provider value={{ step, saveStep }}>
      {children}
    </ScanContext.Provider>
  );
};

export default ScanContext;