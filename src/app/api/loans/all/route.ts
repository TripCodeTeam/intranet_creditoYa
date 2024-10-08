import LoanApplicationService from "@/classes/LoanServices";
import TokenService from "@/classes/TokenServices";
// import TokenService from "@/classes/TokenServices";
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
    ); // Reemplaza "tu-clave-secreta" con tu clave secreta

    if (!decodedToken) {
      throw new Error("Token no válido");
    }

    const { page, pageSize, searchTerm, orderBy, filterByAmount } =
      await req.json();

    const response = await LoanApplicationService.getAll(
      page || 1,
      pageSize || 5,
      searchTerm || null,
      orderBy || "asc",
      filterByAmount || false
    );

    if (!response) {
      throw new Error("Error in obtaining requests");
    }

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}

LoanApplicationService.getAll();
