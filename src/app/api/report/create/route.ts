import IssuesService from "@/classes/IssuesService";
import TokenService from "@/classes/TokenServices";
import { appReport } from "@/types/session";
import axios from "axios";
import { NextResponse } from "next/server";

interface reqReport {
  description: string;
  images?: string[];
  app: appReport;
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
    );

    if (!decodedToken) {
      throw new Error("Token no válido");
    }

    const { description, images, app }: reqReport = await req.json();

    if (!description) throw new Error("description is required!");
    if (!images) throw new Error("images is required!");

    const sopportSendReport = await axios.post(
      process.env.TripCode_Reports_api as string,
      {
        description,
        images,
        app,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (sopportSendReport.data.success == true) {

      const newReport = await IssuesService.create({
        description,
        images,
        app,
      });

      if (newReport === null) throw new Error("Error al crear reporte");

      return NextResponse.json({ success: true, data: newReport });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
