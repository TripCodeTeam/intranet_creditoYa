import { ScalarLoanApplication } from "@/types/session";
import axios from "axios";

export const RefreshDataLoan = async (
  loanId: string,
  token: string
): Promise<ScalarLoanApplication> => {
  try {
    const user = await axios.post(
      "/api/loans/by/id",
      {
        loanId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (user.data.success) {
      const data: ScalarLoanApplication = user.data.data;
      return data;
    } else {
      throw new Error("Data fetch unsuccessful");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching loan data");
  }
};
