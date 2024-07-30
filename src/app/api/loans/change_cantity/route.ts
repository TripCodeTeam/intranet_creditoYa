import LoanApplicationService from "@/classes/LoanServices";
import TokenService from "@/classes/TokenServices";
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

    const { loanId, newCantity, reasonChangeCantity, employeeId } =
      await req.json();

    if (!loanId) throw new Error("loanId is required!");
    if (!newCantity) throw new Error("newCantity is required!");
    if (!reasonChangeCantity)
      throw new Error("reasonChangeCantity is required!");
    if (!newCantity) throw new Error("employeeId is required!");

    const response = await LoanApplicationService.ChangeCantity(
      loanId,
      newCantity,
      reasonChangeCantity,
      employeeId
    );

    if (response) {
      return NextResponse.json({ success: true, data: response });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
