import { transporter } from "@/lib/NodeMailer";
import TokenService from "@/classes/TokenServices";
// import { EmailTemplate } from "@/components/mail/Template";
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

    const formData = await req.formData()

    const files = formData.get("images")

    const {
      addressee,
      content,
      subject,
    }: {
      name: string;
      addressee: string;
      code: number;
      content: string;
      subject: string;
    } = await req.json();

    const data = await transporter.sendMail({
      from: `"Credito ya" ${process.env.GOOGLE_EMAIL} `,
      to: addressee,
      subject: subject,
      text: "¡Funciona!",
      html: content,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
