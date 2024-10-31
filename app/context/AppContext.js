import React, { createContext, useState } from "react";
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isCreate, setIsCreate] = useState(false);

  return (
    <AppContext.Provider value={{ isCreate, setIsCreate}}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;