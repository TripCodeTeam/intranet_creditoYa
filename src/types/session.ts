export type SessionAuth = {
  id?: string;
  name: string;
  lastNames: string;
  email: string;
  phone: string;
  rol: RolIntranet;
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
  typeDocument?: TypesDocument;
  documentFront: string | undefined;
  documentBack: string | undefined;
  number: string | undefined;
  createdAt: Date;
  updatedAt: Date;
};

export type ScalarUser = {
  id?: string;
  password: string;
  email: string;
  name?: string;
  lastNames?: string;
  avatar?: string;
  rol?: RolIntranet;
  phone?: string;
  created_at?: Date;
  updated_at?: Date;
};

export type ScalarLoanApplication = {
  id?: string;
  userId: string;
  employeeId?: string;
  fisrt_flyer: string;
  second_flyer: string;
  third_flyer: string;
  signature: string;
  cantity: string;
  status: Status;
  reasonReject?: string;
  reasonChangeCantity?: string;
  bankSavingAccount: boolean;
  bankNumberAccount: string;
  labor_card: string;
  entity: string;
  terms_and_conditions: boolean;
  created_at: Date;
  updated_at: Date;
};

export type Status =
  | "Pendiente"
  | "Aprobado"
  | "Rechazado"
  | "Borrador"
  | "Archivado";

export type RolIntranet = "admin" | "employee";

export type TypesDocument = "CC" | "CE" | "PASAPORTE";

export type HouseType = "Familiar" | "Propia" | "Arrendada";

export type TypeRol = "Customer_services" | "Manager" | "Loan_manager";

export interface GlobalContextType {
  dataSession: SessionAuth | null;
  isLoading: boolean;
  setDataSession: (option: SessionAuth) => void;
}

export type OptionDash = "Request" | "Accepts" | "Clients" | "Emails" | "User";

export interface DashboardContextType {
  option: OptionDash;
  setOption: (option: OptionDash) => void;
}
