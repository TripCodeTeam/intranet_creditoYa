import ClientServices from "@/classes/ClientServices";
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

    const { page = 1, pageSize = 8 } = await req.json();
    const { users, totalCount } = await ClientServices.all(page, pageSize);

    return NextResponse.json({ success: true, data: users, totalCount });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
