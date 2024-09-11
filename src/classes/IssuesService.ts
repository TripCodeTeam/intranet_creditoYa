import { prisma } from "@/prisma/db";
import { ScalarIssues, statusIssue } from "@/types/session";
import { ReportIssue } from "@prisma/client";

class IssuesService {
  static async create(data: ScalarIssues): Promise<ReportIssue> {
    return prisma.reportIssue.create({ data });
  }

  static async changeStatus(
    reportId: string,
    status: statusIssue
  ): Promise<ReportIssue> {
    return prisma.reportIssue.update({
      where: { id: reportId },
      data: {
        status,
      },
    });
  }

  static async getAllReports(): Promise<ReportIssue[] | null> {
    return prisma.reportIssue.findMany();
  }
}

export default IssuesService;
