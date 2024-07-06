import { prisma } from "@/prisma/db";
import { ScalarUser } from "@/types/session";
import { LoanApplication, UsersIntranet } from "@prisma/client";
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
        rol: data.rol,
      },
    });
  }

  static async signin(email: string, password: string): Promise<UsersIntranet> {
    // Evitar logging en producción
    if (process.env.NODE_ENV !== "production") {
      console.log("class log: ", email, password);
    }

    const userIntranet = await prisma.usersIntranet.findUnique({
      where: { email },
    }).catch(error => console.log(error));

    // // Evitar logging en producción
    // if (process.env.NODE_ENV !== "production") {
    //   // console.log("class log userRes: ", userIntranet);
    //   // !userIntranet && console.log("imposible loguear user con class");
    // }

    // Almacenar el hash de la contraseña en una variable local
    const hashedPassword = userIntranet ? userIntranet.password : "";

    if (!userIntranet || !(await bcrypt.compare(password, hashedPassword))) {
      throw new Error("Credenciales inválidas");
    }

    return userIntranet;
  }

  static async all(): Promise<UsersIntranet[]> {
    return prisma.usersIntranet.findMany();
  }

  static async verifyData(userId: string): Promise<{
    total: number;
    completed: number;
    pending: number;
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { LoanApplication: true },
    });

    if (!user) throw new Error("Usuario no encontrado");

    let total = user.LoanApplication.length;
    let completed = 0;
    let pending = 0;

    user.LoanApplication.forEach((loan) => {
      if (loan.status === "Aprobado") {
        completed++;
      } else if (loan.status === "Pendiente") {
        pending++;
      }
    });

    return { total, completed, pending };
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
