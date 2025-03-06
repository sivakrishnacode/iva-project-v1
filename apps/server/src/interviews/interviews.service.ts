import { PrismaService } from '@/db/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InterviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllInterviews() {
    return this.prisma.interview.findMany({
      include: { candidate: true },
    });
  }

  async deleteInterview(id: string) {
    await this.prisma.interview.delete({
      where: { id },
    });
    return { message: 'Interview deleted successfully' };
  }
}
