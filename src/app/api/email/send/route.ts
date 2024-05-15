import TokenService from "@/classes/TokenServices";
import { NextResponse } from "next/server";
import { transporter } from "../../../../../lib/mail/NodeMailer";

export async function POSt(req: Request) {
  try {
    // Verificar la autenticación JWT
    const authorizationHeader = req.headers.get("Authorization");

    if (!authorizationHeader) {
      return NextResponse.json(
        { message: "Token de autorización no proporcionado" },
        { status: 401 }
      );
    }

    const token = authorizationHeader.split(" ")[1];

    const decodedToken = TokenService.verifyToken(
      token,
      process.env.JWT_SECRET as string
    ); // Reemplaza "tu-clave-secreta" con tu clave secreta

    if (!decodedToken) {
      return NextResponse.json({ message: "Token no válido" }, { status: 401 });
    }

    const {
      emails,
      subject,
      content,
    }: { emails: string[]; subject: string; content: string } =
      await req.json();

    const data = await transporter.sendMail({
      from: `"Credito Ya" ${process.env.GOOGLE_EMAIL}`,
      to: emails,
      subject,
      html: content,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
