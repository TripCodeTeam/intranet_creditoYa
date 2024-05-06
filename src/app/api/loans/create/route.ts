import LoanApplicationService from "@/classes/LoanServices";
import { ScalarLoanApplication } from "@/types/session";
import { NextResponse } from "next/server";
// import TokenService from "@/classes/TokenServices";

export async function POST(req: Request) {
  try {
    const data: ScalarLoanApplication = await req.json();
    // // Verificar la autenticación JWT
    // const authorizationHeader = req.headers.get("Authorization");

    // if (!authorizationHeader) {
    //   throw new Error("Token de autorización no proporcionado");
    // }

    // const token = authorizationHeader.split(" ")[1];

    // const decodedToken = TokenService.verifyToken(
    //   token,
    //   process.env.JWT_SECRET as string
    // ); // Reemplaza "tu-clave-secreta" con tu clave secreta

    // if (!decodedToken) {
    //   throw new Error("Token no válido");
    // }

    const response = await LoanApplicationService.create(data);
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
