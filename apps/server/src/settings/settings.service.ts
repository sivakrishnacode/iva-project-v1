import { PrismaService } from '@/db/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Create a new job
  async createJob(data: Prisma.JobCreateInput) {
    return this.prisma.job.create({
      data: {
        description: data.description,
        location: data.location,
        salary: data.salary,
        title: data.title,
      },
    });
  }

  async getJobs() {
    return this.prisma.job.findMany({
      include: {
        questions: true,
      },
    });
  }

  // ✅ Create an job question for a job
  async createJobQuestion(data: Prisma.JobQuestionCreateInput) {
    return this.prisma.jobQuestion.create({
      data,
    });
  }
}
