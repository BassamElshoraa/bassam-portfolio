import React, { createContext, useContext, useState } from "react";

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [activePage, setActivePage] = useState("about");
  const [filterSkill, setFilterSkill] = useState(null);

  return (
    <AppContext.Provider
      value={{ activePage, setActivePage, filterSkill, setFilterSkill }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
