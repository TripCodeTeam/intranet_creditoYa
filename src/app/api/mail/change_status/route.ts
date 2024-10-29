import { transporter } from "@/lib/NodeMailer";
import TokenService from "@/classes/TokenServices";
// import { EmailTemplate } from "@/components/mail/Template";
import { NextResponse } from "next/server";
import { generateMailChangeStatus } from "@/handlers/templatesEmails/generates/GenerateChangeStatusMail";
import { MJMLtoHTML } from "@/handlers/mjmlToHtml";

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

    const {
      newStatus,
      employeeName,
      loanId,
      mail,
    }: {
      mail: string;
      newStatus: string;
      employeeName: string;
      loanId: string;
    } = await req.json();

    const content = generateMailChangeStatus({
      newStatus,
      employeeName,
      loanId,
    });

    const html = await MJMLtoHTML(content);

    const data = await transporter.sendMail({
      from: `"Credito ya" ${process.env.GOOGLE_EMAIL} `,
      to: mail,
      subject: "El estado de tu prestamo ha cambiado",
      text: "¡Funciona!",
      html,
    });

    // console.log(data);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
