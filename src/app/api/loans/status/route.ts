import LoanApplicationService from "@/classes/LoanServices";
import TokenService from "@/classes/TokenServices";
import { Status } from "@/types/session";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Verificar la autenticación JWT
    const authorizationHeader = req.headers.get("Authorization");

    if (!authorizationHeader) {
      throw new Error("Token de autorización no proporcionado");
    }

    const token = authorizationHeader.split(" ")[1];

    const decodedToken = TokenService.verifyToken(
      token,
      process.env.JWT_SECRET as string
    );

    if (!decodedToken) {
      throw new Error("Token no válido");
    }

    const {
      mail,
      newStatus,
      employeeId,
      employeeName,
      loanApplicationId,
      reason,
    }: {
      mail: string;
      newStatus: Status;
      employeeId: string;
      employeeName: string;
      loanApplicationId: string;
      reason: string | null;
    } = await req.json();

    if (newStatus == "Aprobado") {
      const resStateChange = await LoanApplicationService.changeStatus(
        loanApplicationId,
        newStatus
      );

      if (resStateChange) {
        const addEmployee = await LoanApplicationService.fillEmployeeId(
          loanApplicationId,
          employeeId
        );

        if (addEmployee) {
          return NextResponse.json({ success: true, data: addEmployee });
        }
      }
    }

    if (newStatus == "Rechazado") {
      const resStateChange = await LoanApplicationService.changeStatus(
        loanApplicationId,
        newStatus
      );

      if (resStateChange && reason && employeeId) {
        const resReason = await LoanApplicationService.changeReject(
          loanApplicationId,
          reason as string
        );

        if (resReason) {
          const agreeEmployeeId = await LoanApplicationService.fillEmployeeId(
            loanApplicationId,
            employeeId
          );

          if (agreeEmployeeId) {
            return NextResponse.json({ success: true, data: agreeEmployeeId });
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
