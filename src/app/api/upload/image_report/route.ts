import TokenService from "@/classes/TokenServices";
import cloudinary from "@/lib/cloudinary-conf";
import { NextResponse } from "next/server";

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

    const { img } = await req.json();

    if (!img) throw new Error("img is required");

    const randomUpId = Math.floor(100000 + Math.random() * 900000);

    const response = await cloudinary.v2.uploader.upload(img, {
      folder: "reports-images",
      public_id: `${randomUpId.toString()}-report`
    });

    return NextResponse.json({ success: true, data: response.secure_url });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
