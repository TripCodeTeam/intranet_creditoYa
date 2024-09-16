import TokenService from "@/classes/TokenServices";
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
    const { completeNames, mails, message, files } = await req.json();

    if (!Array.isArray(completeNames) || !Array.isArray(mails)) {
      throw new Error("Los nombres y correos deben ser arrays");
    }

    if (completeNames.length !== mails.length) {
      throw new Error(
        "Los arrays de nombres y correos deben tener la misma longitud"
      );
    }

    const responses = [];

    // Iterar sobre los arrays de nombres y correos para enviar los correos masivamente
    for (let i = 0; i < mails.length; i++) {
      const completeName = completeNames[i];
      const mail = mails[i];

      console.log(completeName, mail);

      const data = await transporter.sendMail({
        from: `"Credito ya" ${process.env.GOOGLE_EMAIL} `,
        to: mail,
        subject: "Activacion cuenta Intranet",
        text: "¡Funciona!",
        html: ``,
      });

      responses.push({ mail, success: true, data });
    }

    return NextResponse.json({ success: true, responses });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
