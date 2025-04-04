import LoanApplicationService from "@/classes/LoanServices";
import TokenService from "@/classes/TokenServices";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
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

    const { page, pageSize, documentNumber } = await req.json();

    const response = await LoanApplicationService.getApprovedLoans(
      page || 1,
      pageSize || 5,
      documentNumber // Pasar el número de documento al servicio
    );

    if (!response) {
      throw new Error("Error in obtaining loans");
    }

    return NextResponse.json({
      success: true,
      data: response.data,
      total: response.total,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
