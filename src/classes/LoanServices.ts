// Importar las declaraciones necesarias

import { prisma } from "@/prisma/db";
import { LoanApplication } from "@prisma/client";
import { ScalarLoanApplication, Status } from "@/types/session";

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
    data: Partial<ScalarLoanApplication>
  ): Promise<LoanApplication> {
    return prisma.loanApplication.update({ where: { id }, data });
  }

  // Método para eliminar una solicitud de préstamo
  static async delete(id: string): Promise<LoanApplication> {
    return prisma.loanApplication.delete({ where: { id } });
  }

  // Método para obtener todas las solicitudes de préstamo
  static async getAll(
    page: number = 1,
    pageSize: number = 5,
    searchTerm: string | null = null,
    orderBy: "asc" | "desc" = "asc",
    filterByAmount: boolean = false
  ): Promise<{ data: LoanApplication[]; total: number }> {
    const skip = (page - 1) * pageSize;

    // Construir el objeto de filtros
    const where: any = {};

    if (searchTerm) {
      where.OR = [
        { user: { names: { contains: searchTerm, mode: "insensitive" } } },
        {
          user: {
            firstLastName: { contains: searchTerm, mode: "insensitive" },
          },
        },
        {
          user: {
            secondLastName: { contains: searchTerm, mode: "insensitive" },
          },
        },
        { user: { Document: { some: { number: { contains: searchTerm } } } } },
      ];
    }

    // Construir el objeto de ordenación
    const orderByClause = filterByAmount
      ? { cantity: orderBy }
      : { created_at: orderBy };

    // Obtener las solicitudes de préstamo con paginación, filtros y ordenación
    const [data, total] = await prisma.$transaction([
      prisma.loanApplication.findMany({
        where,
        orderBy: orderByClause,
        skip,
        take: pageSize,
        include: {
          user: true, // Incluir la información del usuario
        },
      }),
      prisma.loanApplication.count({ where }),
    ]);

    return { data, total };
  }

  // Método para obtener las solicitudes de préstamo con estado "Pendiente"
  static async getPendingLoans(
    page: number = 1,
    pageSize: number = 5
  ): Promise<{ data: LoanApplication[]; total: number }> {
    const skip = (page - 1) * pageSize;

    // Construir el objeto de filtros
    const where: any = {
      status: "Pendiente", // Asegúrate de que el valor coincida exactamente con los valores en la base de datos
    };

    try {
      // Obtener las solicitudes de préstamo con paginación y filtro por estado
      const [data, total] = await prisma.$transaction([
        prisma.loanApplication.findMany({
          where,
          skip,
          take: pageSize,
          include: {
            user: true, // Incluir la información del usuario
          },
        }),
        prisma.loanApplication.count({ where }),
      ]);

      // console.log("Data:", data);
      // console.log("Total:", total);

      return { data, total };
    } catch (error) {
      console.error("Error getting pending loans:", error);
      throw new Error("Error getting pending loans");
    }
  }

  // Método para obtener las solicitudes de préstamo con estado "Aprobado"
  static async getApprovedLoans(
    page: number = 1,
    pageSize: number = 5,
    documentNumber?: string // Añadir parámetro opcional para el número de documento
  ): Promise<{ data: LoanApplication[]; total: number }> {
    const skip = (page - 1) * pageSize;

    // Construir el objeto de filtros
    const where: any = {
      status: "Aprobado",
    };

    if (documentNumber) {
      where.user = {
        Document: {
          some: { number: documentNumber }, // Filtrar por número de documento
        },
      };
    }

    try {
      // Obtener las solicitudes de préstamo con paginación y filtro por estado y documento
      const [data, total] = await prisma.$transaction([
        prisma.loanApplication.findMany({
          where,
          skip,
          take: pageSize,
          include: {
            user: {
              include: {
                Document: true, // Incluir el documento en la respuesta
              },
            },
          },
        }),
        prisma.loanApplication.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      console.error("Error getting approved loans:", error);
      throw new Error("Error getting approved loans");
    }
  }

  // Método para obtener las solicitudes de préstamo con estado "Aplazado"
  static async getDeferredLoans(
    page: number = 1,
    pageSize: number = 5,
    documentNumber?: string // Añadir parámetro opcional para el número de documento
  ): Promise<{ data: LoanApplication[]; total: number }> {
    const skip = (page - 1) * pageSize;

    // Construir el objeto de filtros
    const where: any = {
      status: "Aplazado", // Asegúrate de que el valor coincida exactamente con los valores en la base de datos
    };

    // Si se proporciona un número de documento, agregar filtro para el documento del usuario
    if (documentNumber) {
      where.user = {
        Document: {
          some: { number: documentNumber }, // Filtrar por número de documento
        },
      };
    }

    try {
      // Obtener las solicitudes de préstamo con paginación y filtro por estado y documento
      const [data, total] = await prisma.$transaction([
        prisma.loanApplication.findMany({
          where,
          skip,
          take: pageSize,
          include: {
            user: {
              include: {
                Document: true, // Incluir el documento en la respuesta
              },
            },
          },
        }),
        prisma.loanApplication.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      console.error("Error getting deferred loans:", error);
      throw new Error("Error getting deferred loans");
    }
  }

  // Método para obtener las solicitudes de préstamo con newCantity definido y newCantityOpt nulo
  static async getLoansWithDefinedNewCantity(
    page: number = 1,
    pageSize: number = 5,
    documentNumber?: string // Añadir parámetro opcional para el número de documento
  ): Promise<{ data: LoanApplication[]; total: number }> {
    const skip = (page - 1) * pageSize;

    // Construir el objeto de filtros
    const where: any = {
      newCantity: { not: null }, // newCantity debe estar definido
      newCantityOpt: null, // newCantityOpt debe ser nulo
    };

    // Si se proporciona un número de documento, agregar filtro para el documento del usuario
    if (documentNumber) {
      where.user = {
        Document: {
          some: { number: documentNumber }, // Filtrar por número de documento
        },
      };
    }

    try {
      // Obtener las solicitudes de préstamo con paginación y filtros especificados
      const [data, total] = await prisma.$transaction([
        prisma.loanApplication.findMany({
          where,
          skip,
          take: pageSize,
          include: {
            user: {
              include: {
                Document: true, // Incluir el documento en la respuesta
              },
            },
          },
        }),
        prisma.loanApplication.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      console.error("Error getting loans with defined newCantity:", error);
      throw new Error("Error getting loans with defined newCantity");
    }
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
    newCantity: string,
    reasonChangeCantity: string,
    employeeId: string
  ): Promise<LoanApplication> {
    return prisma.loanApplication.update({
      where: { id: loanId },
      data: {
        newCantity,
        reasonChangeCantity,
        employeeId,
      },
    });
  }
}

// Exportar la clase LoanApplicationService
export default LoanApplicationService;
