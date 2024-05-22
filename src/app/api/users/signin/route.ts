import TokenService from "@/classes/TokenServices";
import UserServices from "@/classes/UserServices";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("dates received: ", email, password)

    if (!email) throw new Error("email is required");
    if (!password) throw new Error("Psassword is required");

    const user = await UserServices.signin(email, password);
    console.log("user complete: ", user)

    const payload = { userId: user.id, userEmail: user.email };
    const secret = process.env.JWT_SECRET as string;
    const token = TokenService.createToken(payload, secret);

    return NextResponse.json({ success: true, data: { ...user, token } });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
