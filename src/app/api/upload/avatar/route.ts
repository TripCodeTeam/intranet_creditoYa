import ClientServices from "@/classes/ClientServices";
import TokenService from "@/classes/TokenServices";
import cloudinary from "@/lib/cloudinary-conf";
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

    const formData = await req.formData();
    const image = formData.get("img") as string;
    const userId = formData.get("userId") as string;

    const responseUpload = await cloudinary.v2.uploader.upload(image, {
      folder: "avatarIntranet",
      public_id: `avatarIntr.${userId}`,
    });

    if (responseUpload)
      return NextResponse.json({
        success: true,
        data: responseUpload.secure_url,
      });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
