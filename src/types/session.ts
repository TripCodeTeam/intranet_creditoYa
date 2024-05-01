export type SessionAuth = {
  id?: string;
  nameSession: string;
};

export interface GlobalContextType {
  dataSession: SessionAuth | null;
  isLoading: boolean;
  setDataSession: (sessionData: SessionAuth) => void;
}

export type BtnTypesInfo = {
  id?: string;
  status: string;
  name: string;
  description: string;
  icon: string;
};
