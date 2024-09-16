import { prisma } from "@/prisma/db";
import { scalarWhatsappSession } from "@/types/session";
import { WhatsappSession } from "@prisma/client";

class SessionService {
  static async create(data: scalarWhatsappSession): Promise<WhatsappSession> {
    return prisma.whatsappSession.create({
      data,
    });
  }

  static async getActiveSession(): Promise<WhatsappSession | null> {
    return prisma.whatsappSession.findFirst({
      where: {
        status: "activo", // Busca la sesión con estado activo
      },
      orderBy: {
        created_at: "desc", // Ordena por fecha de creación descendente
      },
    });
  }

  static async revokeActiveSession(): Promise<WhatsappSession | null> {
    // Obtener la sesión activa
    const activeSession = await this.getActiveSession();

    if (!activeSession) {
      throw new Error("No active session found.");
    }

    // Actualizar el estado de la sesión activa a "revocado"
    return prisma.whatsappSession.update({
      where: {
        id: activeSession.id,
      },
      data: {
        status: "revocado",
      },
    });
  }

  static async deleteSession(id: string): Promise<WhatsappSession | null> {
    return prisma.whatsappSession.delete({
      where: {
        id: id,
      },
    });
  }
}

export default SessionService;
