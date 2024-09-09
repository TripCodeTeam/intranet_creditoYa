import ClientServices from "@/classes/ClientServices";
import TokenService from "@/classes/TokenServices";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Verificar la autenticación JWT
    const authorizationHeader = req.headers.get("Authorization");

    if (!authorizationHeader) {
      return NextResponse.json({
        success: false,
        error: "Token de autorización no proporcionado",
      });
    }

    const token = authorizationHeader.split(" ")[1];
    const decodedToken = TokenService.verifyToken(
      token,
      process.env.JWT_SECRET as string
    );

    if (!decodedToken) {
      return NextResponse.json({ success: false, error: "Token no válido" });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" });
    }

    const response = await ClientServices.get(userId);

    if (response) {
      return NextResponse.json({ success: true, data: response });
    } else {
      return NextResponse.json({ success: false, error: "Client not found" });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
