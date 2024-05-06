import ClientServices from "@/classes/ClientServices";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const authToken = req.headers.get("authorization");
    const token = authToken?.split(" ")[1];

    if (!token) {
      throw new Error("Token is required");
    }

    if (!userId) {
      throw new Error("userId is required");
    }

    const response = await ClientServices.get(userId);
    const src = response?.avatar;
    return NextResponse.json({ success: true, data: src });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
