// Importar las declaraciones necesarias

import { prisma } from "@/prisma/db";
import { LoanApplication } from "@prisma/client";
import { ScalarDocument, ScalarLoanApplication, Status } from "@/types/session";

// Clase para el servicio de LoanApplication
class LoanApplicationService {
  // Método para crear una solicitud de préstamo
  static async create(data: ScalarLoanApplication): Promise<LoanApplication> {
    const { userId, ...loanApplicationDataWithoutUserId } = data;
    const loanApplicationData = {
      ...loanApplicationDataWithoutUserId,
      user: {
        connect: {
          id: data.userId,
        },
      },
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

  // Método para obtener una solicitud de préstamo por el ID del usuario
  static async getByUserId(userId: string): Promise<LoanApplication | null> {
    return prisma.loanApplication.findFirst({ where: { userId } });
  }

  // Método para obtener todas las solicitudes de préstamo por userId
  static async getAllByUserId(userId: string): Promise<LoanApplication[]> {
    return prisma.loanApplication.findMany({
      where: { userId },
    });
  }

  // Metodo para cambiar Status de una solicitud
  static async changeStatus(loanApplicationId: string, newStatus: Status) {
    return prisma.loanApplication.update({
      where: { id: loanApplicationId },
      data: { status: newStatus },
    });
  }

  // Metodo para cambiar rejectReason de una solicitud
  static async changeReject(loanApplicationId: string, reason: string) {
    return prisma.loanApplication.update({
      where: { id: loanApplicationId },
      data: { reasonReject: reason },
    });
  }

  // Método para llenar el campo "employeeId" de una solicitud de préstamo específica
  static async fillEmployeeId(
    loanId: string,
    employeeId: string
  ): Promise<LoanApplication> {
    return prisma.loanApplication.update({
      where: { id: loanId },
      data: { employeeId },
    });
  }

  // Metodo para cambiar cantidad y adjuntar razon del cambio
  static async ChangeCantity(
    loanId: string,
    cantity: string,
    reasonChangeCantity: string
  ): Promise<LoanApplication> {
    return prisma.loanApplication.update({
      where: { id: loanId },
      data: {
        cantity,
        reasonChangeCantity,
      },
    });
  }
}

// Exportar la clase LoanApplicationService
export default LoanApplicationService;
