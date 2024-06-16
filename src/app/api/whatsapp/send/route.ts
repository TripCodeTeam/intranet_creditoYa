import { NextResponse } from "next/server";
import { messageMassiveReq } from "@/types/whatsapp";
import TokenService from "@/classes/TokenServices";
import { allSessions } from "@/controllers/Whassap";

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
      onlySelect,
      image,
      message,
      idSession,
      zipCode,
    }: messageMassiveReq = await req.json();

    const client = allSessions[idSession];

    let lenSends = onlySelect.length;
    let succesSends = 0;

    for (let contacts of onlySelect) {
      let idChat = `${zipCode}${contacts.number}@c.us`;
      client.sendMessage(idChat, message);
      succesSends += 1;
    }

    if (succesSends < lenSends) {
      throw new Error(`${succesSends / lenSends} messages sent`);
    }

    console.log(`success send: ${succesSends}`);

    if (succesSends === lenSends) {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
