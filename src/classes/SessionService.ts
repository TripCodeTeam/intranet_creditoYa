import { prisma } from "@/prisma/db";
import { scalarWhatsappSession } from "@/types/session";
import { WhatsappSession } from "@prisma/client";

class SessionService {
  static async create(data: scalarWhatsappSession): Promise<WhatsappSession> {
    return prisma.whatsappSession.create({
      data,
    });
  }

  static async getSession(): Promise<WhatsappSession[]> {
    return prisma.whatsappSession.findMany();
  }
}

export default SessionService;
