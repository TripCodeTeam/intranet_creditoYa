"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

import Cookies from "js-cookie";

import {
  SessionAuth,
  DashboardContextType,
  OptionDash,
} from "../types/session";

const GlobalContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [option, setOptionDashboard] = useState<OptionDash>("Request");

  useEffect(() => {
    const optsDash = Cookies.get("optionDash");
    if (optsDash) {
      setOption(JSON.parse(optsDash) as OptionDash);
    }
  }, []);

  const setOption = (option: OptionDash) => {
    setOptionDashboard(option);
    Cookies.set("optionDash", JSON.stringify(option));
  };

  return (
    <GlobalContext.Provider value={{ option, setOption }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
}
