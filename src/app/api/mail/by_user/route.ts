import { transporter } from "@/lib/NodeMailer";
import TokenService from "@/classes/TokenServices";
import { NextResponse } from "next/server";
import { Readable } from "nodemailer/lib/xoauth2";

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

    const formdata = await req.formData();

    const subject = formdata.get("subject") as string;
    const content = formdata.get("content") as string;
    const addressee = formdata.getAll("addressee") as string | string[];
    const files = formdata.getAll("files") as File[];

    console.log(files);

    const attachmentsFiles = await Promise.all(
      files.map(async (file: File) => {
        // Generar un nombre único para el archivo
        const filename = `${Date.now()}-${file.name}`;

        // Crear un stream de lectura a partir del contenido del archivo
        const fileStream = new Readable();
        fileStream.push(Buffer.from(await file.arrayBuffer()));
        fileStream.push(null);

        // Devolver el objeto de archivo adjunto con el stream de lectura
        return {
          filename: filename,
          content: fileStream,
        };
      })
    );

    console.log(attachmentsFiles);

    const data = await transporter.sendMail({
      from: `"Credito ya" ${process.env.GOOGLE_EMAIL} `,
      to: addressee,
      subject: subject,
      text: "¡Funciona!",
      html: content,
      attachments: attachmentsFiles,
    });

    console.log(data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
