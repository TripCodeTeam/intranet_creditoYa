import { createSessionWP } from "@/controllers/Whassap";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, socket } = await req.json();
    console.log(id, socket);
    createSessionWP(id, socket);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
