import TokenService from "@/classes/TokenServices";
import UserServices from "@/classes/UserServices";
import { ScalarUser } from "@/types/session";
import { UsersIntranet } from "@prisma/client";
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

    const { employeeId, data }: { employeeId: string; data: UsersIntranet } =
      await req.json();

    if (!employeeId) throw new Error("EmployeeId is required");
    if (!data) throw new Error("EmployeeId is required");

    const updateUser = await UserServices.updateProfile(employeeId, data);

    return NextResponse.json({ success: true, data: updateUser });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, data: error.message });
    }
  }
}
