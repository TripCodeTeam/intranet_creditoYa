import TokenService from "@/classes/TokenServices";
import { MJMLtoHTML } from "@/handlers/mjmlToHtml";
import { ActiveAccountMail } from "@/handlers/templatesEmails/generates/GenerateActiveAccountMail";
import { transporter } from "@/lib/NodeMailer";
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

    // Recibir el array de nombres y correos electrónicos
    const { completeName, mail, password } = await req.json();

    const content = ActiveAccountMail({ completeName, mail, password });

    const html = await MJMLtoHTML(content);

    const data = await transporter.sendMail({
      from: `"Credito ya" ${process.env.GOOGLE_EMAIL} `,
      to: mail,
      subject: "Activacion cuenta Intranet",
      text: "¡Funciona!",
      html,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
