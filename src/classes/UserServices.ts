import { prisma } from "@/prisma/db";
import { ScalarUser, scalarClient } from "@/types/session";
import { User, UsersIntranet } from "@prisma/client";
import bcrypt from "bcryptjs";

class UserServices {
  static async fastCreate(data: ScalarUser): Promise<UsersIntranet> {
    const existEmail = await prisma.usersIntranet.findUnique({
      where: { email: data.email },
    });

    if (existEmail) {
      throw new Error("El correo electrónico ya está en uso");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.usersIntranet.create({
      data: {
        name: data.name as string,
        lastNames: data.lastNames as string,
        email: data.email,
        password: hashedPassword,
      },
    });
  }

  static async signin(email: string, password: string): Promise<UsersIntranet> {
    const usersIntranet = await prisma.usersIntranet.findUnique({
      where: { email },
    });

    if (
      !usersIntranet ||
      !(await bcrypt.compare(password, usersIntranet.password))
    ) {
      throw new Error("Credenciales invalidas");
    }

    return usersIntranet;
  }

  static async all(): Promise<User[]> {
    return prisma.user.findMany();
  }

  static async verifyData(userId: string): Promise<{
    total: number;
    completed: number;
    paid: number;
    pending: number;
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { LoanApplication: true },
    });

    if (!user) throw new Error("Usuario no encontrado");

    let total = user.LoanApplication.length;
    let completed = 0;
    let paid = 0;
    let pending = 0;

    user.LoanApplication.forEach((loan) => {
      if (loan.status === "Completado") {
        completed++;
      } else if (loan.status === "Pagado") {
        paid++;
      } else if (loan.status === "Pendiente") {
        pending++;
      }
    });

    return { total, completed, paid, pending };
  }

  static async get(employeeId: string): Promise<UsersIntranet> {
    const user = await prisma.usersIntranet.findUnique({
      where: { id: employeeId },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user;
  }
}

export default UserServices;
