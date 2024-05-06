"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

import Cookies from "js-cookie";

import { SessionAuth, DashboardContextType } from "../types/session";

const GlobalContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [option, setOptionDashboard] = useState<string>("Request");

  useEffect(() => {
    const optsDash = Cookies.get("optionDash");
    if (optsDash) {
      setOption(JSON.parse(optsDash));
    }
  }, []);

  const setOption = (option: string) => {
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
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}
