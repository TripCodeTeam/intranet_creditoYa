import webpush from "@/lib/webpush";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, subscription } = await req.json();

  const payload = JSON.stringify({
    title: "Nueva notificación",
    body: message,
    icon: "/icon-384x384.png",
  });

  console.log(payload);

  try {
    await webpush.sendNotification(subscription, payload);

    return NextResponse.json(
      { message: "Notificacion creada c0n exito" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al enviar la notificación" },
      { status: 500 }
    );
  }
}
