export type SessionAuth = {
  id?: string;
  name: string;
  lastNames: string;
  email: string;
  phone: string;
  rol: RolIntranet;
  isActive?: boolean;
  avatar: string;
  token: string;
};

export type ScalarClient = {
  id?: string;
  password: string;
  email: string;
  names: string;
  firstLastName: string;
  secondLastName: string;
  currentCompanie?: companiesUser;
  avatar?: string;
  phone?: string;
  residence_phone_number?: string;
  phone_is_wp?: boolean;
  phone_whatsapp?: string;
  birth_day?: Date;
  place_of_birth?: string;
  genre?: string;
  residence_address?: string;
  city?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ScalarDocument = {
  id: string;
  userId: string;
  typeDocument: TypesDocument;
  documentSides: string;
  imageWithCC: string | undefined;
  number: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  upId: string;
};

export type ScalarUser = {
  id?: string;
  password: string;
  email: string;
  name?: string;
  lastNames?: string;
  avatar?: string;
  rol?: RolIntranet;
  isActive?: boolean;
  phone?: string;
  created_at?: Date;
  updated_at?: Date;
};

export type ScalarLoanApplication = {
  [x: string]: any;
  id?: string;
  userId: string;
  employeeId?: string;
  fisrt_flyer: string;
  upid_first_flayer: string;
  second_flyer: string;
  upid_second_flyer: string;
  third_flyer: string;
  upid_third_flayer: string;
  signature: string;
  upSignatureId: string;
  cantity: string;
  status: Status;
  reasonReject?: string;
  reasonChangeCantity?: string;
  newCantity?: string;
  newCantityOpt?: boolean;
  bankSavingAccount: boolean;
  bankNumberAccount: string;
  labor_card: string;
  upid_labor_card: string;
  entity: string;
  terms_and_conditions: boolean;
  clientInfo?: ScalarClient;
  created_at: Date;
  updated_at: Date;
};

export type ScalarIssues = {
  id?: string;
  title: string;
  description: string;
  images?: string[];
  app: appReport;
  status?: statusIssue;
  created_at?: Date;
  updated_at?: Date;
};

export type Status =
  | "Pendiente"
  | "Aprobado"
  | "Aplazado"
  | "Borrador"
  | "Archivado";

export type RolIntranet = "admin" | "employee";

export type TypesDocument = "CC" | "CE" | "PASAPORTE";

export type HouseType = "Familiar" | "Propia" | "Arrendada";

export type TypeRol = "Customer_services" | "Manager" | "Loan_manager";

export type statusIssue = "activo" | "pendiente" | "corregido";

export type appReport = "intranet" | "clients";

export interface GlobalContextType {
  dataSession: SessionAuth | null;
  isLoading: boolean;
  setDataSession: (option: SessionAuth) => void;
}

export type OptionDash =
  | "Request"
  | "Accepts"
  | "Clients"
  | "Emails"
  | "User"
  | "Issues";

export interface DashboardContextType {
  option: OptionDash;
  setOption: (option: OptionDash) => void;
}

export type scalarWhatsappSession = {
  id?: string;
  sessionId: string;
  created_at?: string;
  updated_at?: string;
};

export type companiesUser =
  | "incauca_sas"
  | "incauca_cosecha"
  | "providencia_sas"
  | "providencia_cosecha"
  | "con_alta"
  | "pichichi_sas"
  | "pichichi_coorte"
  | "valor_agregado"
  | "no";
