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

    const { page, pageSize } = await req.json();

    const response = await LoanApplicationService.getLoansWithDefinedNewCantity(
      page || 1,
      pageSize || 5
    );

    console.log(response);

    if (!response) {
      throw new Error("Error in obtaining pending loans");
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
