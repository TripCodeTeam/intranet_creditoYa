import ClientServices from "@/classes/ClientServices";
import TokenService from "@/classes/TokenServices";
import { ScalarClient } from "@/types/session";
// import { ScalarClient } from "@/types/session";
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

    const { query } = await req.json();

    if (!query) throw new Error("query is required!");

    const user = await ClientServices.searchUser(query);

    console.log(user);

    if (user && user.length === 0)
      return NextResponse.json({
        success: true,
        data: "Usuario no encontrado",
      });

    if (user === null) throw new Error("Error al buscar usuario");

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
