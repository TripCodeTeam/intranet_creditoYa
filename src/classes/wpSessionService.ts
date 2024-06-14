import { Session } from "@prisma/client";
import { ScalarSession } from "@/types/session";
import { prisma } from "../prisma/db";

/**
 * Creacion de sessiones de ingreso para whatsapp bot
 */
class SessionService {
  /**
   *
   * @param data
   * @returns
   */
  static async create(data: ScalarSession): Promise<Session> {
    if (!data.nameSession) {
      throw new Error("Session_id is required");
    }

    return prisma.session.create({
      data: {
        nameSession: data.nameSession,
      },
    });
  }

  /**
   *
   * @returns
   */
  static async all(): Promise<Session[]> {
    return prisma.session.findMany();
  }
}

export default SessionService;
