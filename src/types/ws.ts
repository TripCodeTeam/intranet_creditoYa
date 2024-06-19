import { ScalarLoanApplication, Status } from "./session";

export type EventClient = {
  type: EventsClient;
  data: ScalarLoanApplication | ScalarLoanApplication[] | reqChangeState;
};

export type reqChangeState = {
  userId: string;
  nameUser: string;
  emailUser: string;
  employeeId: string;
  loanApplicationId: string;
  state: Status;
  reason: string | null;
};

export type EventWs = {
  type: Events;
  from: string;
  owner?: string;
  data:
    | ScalarLoanApplication
    | ScalarLoanApplication[]
    | string
    | reqChangeState;
};

type Events =
  | "create_new_loan"
  | "changeState"
  | "createSession"
  | "new_loan"
  | "newApprove";

type EventsClient = "updateLoan" | "onNewLoan" | "newApprove";
