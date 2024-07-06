  "use client"

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

import Cookies from "js-cookie";

import { GlobalContextType, SessionAuth } from "../types/session";

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [dataSession, setSessionData] = useState<SessionAuth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const infoSession = Cookies.get("SessionData");
    if (infoSession) {
      setSessionData(JSON.parse(infoSession));
      setIsLoading(false);
    }
  }, []);

  const setDataSession = (userData: SessionAuth) => {
    setSessionData(userData);
    Cookies.set("SessionData", JSON.stringify(userData), { expires: 2 });
  };

  return (
    <GlobalContext.Provider value={{ dataSession, isLoading, setDataSession }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}
