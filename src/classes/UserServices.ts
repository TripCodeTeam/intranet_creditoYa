import { prisma } from "@/prisma/db";
import { ScalarUser } from "@/types/session";
import { UsersIntranet } from "@prisma/client";
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
    console.log("class log: ", email, password)

    const userIntranet = await prisma.usersIntranet.findUnique({
      where: { email },
    }).catch((error) => console.log("class error: ", error));

    console.log("class log userRes: ", userIntranet)
    !userIntranet && console.log("imposible loguear user con class") 

    if (
      !userIntranet ||
      !(await bcrypt.compare(password, userIntranet.password))
    ) {
      throw new Error("Credenciales invalidas");
    }

    return userIntranet;
  }

  static async all(): Promise<UsersIntranet[]> {
    return prisma.usersIntranet.findMany();
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
