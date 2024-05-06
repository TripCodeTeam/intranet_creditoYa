import { prisma } from "@/prisma/db";
import { ScalarLoanApplication } from "@/types/session";
import { LoanApplication } from "@prisma/client";

// Clase para el servicio de LoanApplication
class LoanApplicationService {
  // Método para crear una solicitud de préstamo
  static async create(data: ScalarLoanApplication): Promise<LoanApplication> {
    const loanApplicationData = {
      ...data,
    };
    return prisma.loanApplication.create({ data: loanApplicationData });
  }

  // Método para obtener una solicitud de préstamo por su ID
  static async get(id: string): Promise<LoanApplication | null> {
    return prisma.loanApplication.findUnique({ where: { id } });
  }

  // Método para actualizar una solicitud de préstamo
  static async update(
    id: string,
    data: ScalarLoanApplication
  ): Promise<LoanApplication> {
    return prisma.loanApplication.update({ where: { id }, data });
  }

  // Método para eliminar una solicitud de préstamo
  static async delete(id: string): Promise<LoanApplication> {
    return prisma.loanApplication.delete({ where: { id } });
  }

  // Método para obtener todas las solicitudes de préstamo
  static async getAll(): Promise<LoanApplication[]> {
    return prisma.loanApplication.findMany();
  }
}

export default LoanApplicationService