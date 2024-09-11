import IssuesService from "@/classes/IssuesService";
import TokenService from "@/classes/TokenServices";
import { NextResponse } from "next/server";

interface reqReport {
  title: string;
  description: string;
  images: string[];
}

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

    const { reportId, status } = await req.json();

    if (!reportId) throw new Error("reportId is required!");
    if (!status) throw new Error("status is required!");

    const newReport = await IssuesService.changeStatus(reportId, status);

    if (newReport === null) throw new Error("Error al crear reporte");

    return NextResponse.json({ success: true, data: newReport });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
