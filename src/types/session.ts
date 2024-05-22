export type SessionAuth = {
  id?: string;
  name: string;
  lastNames: string;
  email: string;
  phone: string;
  rol: string;
  avatar: string;
  token: string;
};

export type scalarClient = {
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
  phone_residence?: string;
  residence_address?: string;
  city?: string;
  housing_type?: HouseType;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ScalarUser = {
  id?: string;
  password: string;
  email: string;
  name?: string;
  lastNames?: string;
  avatar?: string;
  rol?: string;
  phone?: string;
  created_at?: Date;
  updated_at?: Date;
};

export type ScalarLoanApplication = {
  id?: string;
  userId: string;
  employeeId?: string;
  email: string;
  principal_debtor: string;
  co_debtor: string;
  affiliated_company: string;
  nit: string;
  requested_amount: string;
  deadline: string;
  payment: typePayment;
  quota_value: string;
  firtLastName: string;
  secondLastName: string;
  names: string;
  occupation: string;
  typeDocument: TypesDocument;
  numberDocument: string;
  persons_in_charge: string;
  monthly_expenses: string;
  birthDate: Date;
  place_birth: string;
  destination_resources: string;
  city: string;
  genre: string;
  marital_status: string;
  cellPhone: string;
  residence_address: string;
  residence_phone: string;
  housing_type: HouseType;
  vehicle: ifOrNot;
  vehicleType?: string;
  whatsapp_number: string;
  pignorado: string;
  in_favor_pignorado?: string;
  commercial_value: string;
  other_personal_commercial_value: string;
  family_members_in_company_agreement: ifOrNot;
  is_currently_codebtor: ifOrNot;
  codebtor_in_creditoya?: ifOrNot;
  codebtor_origin_creditoya?: string;
  other_entity: ifOrNot;
  name_other_entity?: string;
  amount_in_the_other_entity?: string;
  complete_name_spouse?: string;
  number_document_spouse?: string;
  phone_spouse?: string;
  name_company_spouse?: string;
  phone_company_spoue?: string;
  total_monthly_income: string;
  total_assets: string;
  total_liabilities: string;
  patrimony: string;
  court: Date;
  number_employees: string;
  other_income_other_principal: ifOrNot;
  which_other_income?: string;
  monthly_income?: string;
  personal_reference_name: string;
  personal_reference_work_company_name: string;
  personal_reference_city: string;
  personal_reference_address: string;
  personal_reference_number_residence?: string;
  personal_reference_number_phone: string;
  family_reference_name: string;
  family_reference_work_company_name: string;
  family_reference_city: string;
  family_reference_address: string;
  family_reference_number_residence?: string;
  family_reference_number_phone: string;
  remarks?: string;
  status: Status;
  fixed_term: ifOrNot;
  labor_or_work: ifOrNot;
  labor_seniority_contracts: string;
  date_relationship: Date;
  labor_seniority: string;
  contract_termination_date?: string;
  indefinite_term: ifOrNot;
  average_variable_salary: string;
  monthly_discounts: string;
  current_loans_affecting: ifOrNot;
  affecting_loan_entity_name?: string;
  affecting_loan_balance?: string;
  affecting_loan_quota_value?: string;
  bankCurrentAccount: boolean;
  bankSavingAccount: boolean;
  bankNumberAccount: string;
  entity: string;
  ccNumber: string;
  terms_and_conditions: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Status =
  | "Pendiente"
  | "Aprobado"
  | "Rechazado"
  | "Borrador"
  | "Pagado"
  | "Vencido"
  | "En_mora"
  | "En_proceso_de_cobro"
  | "En_negociacion"
  | "Completado";

export type typePayment = "Semanal" | "Quincenal" | "Mensual";

export type ifOrNot = "Si" | "No";

export type MaritalStatus =
  | "Casado"
  | "Casada"
  | "Soltero"
  | "Soltera"
  | "Separado"
  | "Separada"
  | "Divorciado"
  | "Divorciada"
  | "Union libre"
  | "Viudo"
  | "Viuda";

export type TypesDocument = "CC" | "CE" | "PASAPORTE";

export type HouseType = "Familiar" | "Propia" | "Arrendada";

export type TypeRol = "Customer_services" | "Manager" | "Loan_manager";

export interface GlobalContextType {
  dataSession: SessionAuth | null;
  isLoading: boolean;
  setDataSession: (option: SessionAuth) => void;
}

export interface DashboardContextType {
  option: string;
  setOption: (option: string) => void;
}
