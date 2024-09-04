import SessionService from "@/classes/SessionService";
import TokenService from "@/classes/TokenServices";
import { scalarWhatsappSession } from "@/types/session";
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

    const getSession = await SessionService.getSession();

    if (getSession.length === 0) throw new Error("No hay sessiones guardadas");

    if (getSession)
      return NextResponse.json({ success: true, data: getSession[0] });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
