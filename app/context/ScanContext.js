import React, { createContext, useEffect, useState, useContext } from "react";
export const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [phieuNXContext, setPhieuNXContext] = useState(null)

  const saveStep = (data) => {
    setStep(data);
  };

  return (
    <ScanContext.Provider value={{ step, saveStep, setPhieuNXContext, phieuNXContext }}>
      {children}
    </ScanContext.Provider>
  );
};

export default ScanContext;