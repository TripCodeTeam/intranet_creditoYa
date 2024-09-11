import TokenService from "@/classes/TokenServices";
import cloudinary from "@/lib/cloudinary-conf";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { Buffer } from "buffer";

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

    const { img } = await req.json(); // img será la URL del blob

    const uuidRandom = randomUUID();

    console.log(uuidRandom);
    console.log(img);

    // Descargar el blob de la URL usando fetch
    const response = await fetch(img);
    const arrayBuffer = await response.arrayBuffer(); // Convertir el blob a un Buffer
    const buffer = Buffer.from(arrayBuffer);

    // Subir el buffer a Cloudinary
    const responseUpload = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: "reportImages", public_id: uuidRandom },
        (error, result) => {
          if (error) {
            reject(new Error("Error al subir la imagen a Cloudinary"));
          }
          resolve(result);
        }
      );
      stream.end(buffer); // Enviar el buffer a Cloudinary
    });

    if (responseUpload) {
      return NextResponse.json({
        success: true,
        data: (responseUpload as any).secure_url,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
