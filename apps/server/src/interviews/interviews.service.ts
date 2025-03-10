import { PrismaService } from '@/db/prisma.service';
import { Injectable } from '@nestjs/common';
import { InterviewStatus, Prisma } from '@prisma/client';

@Injectable()
export class InterviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllInterviews(status?: InterviewStatus) {
    return this.prisma.interview.findMany({
      where: status
        ? {
            status: status,
          }
        : {},
      include: { candidate: true },
      orderBy: { score: 'asc' },
    });
  }

  async deleteInterview(id: string) {
    await this.prisma.interview.delete({
      where: { id },
    });
    return { message: 'Interview deleted successfully' };
  }
}
