import { Injectable } from '@nestjs/common';
import { CandidateStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class CandidateService {
  constructor(private prisma: PrismaService) {}

  async getAllCandidates(status?: 'HIRED' | 'PENDING' | 'REJECTED') {
    const whereCondition = status ? { status } : {};

    const candidates = await this.prisma.candidate.findMany({
      where: whereCondition,
      include: { interviews: true }, // Include interview details
    });

    return candidates.map((candidate) => ({
      ...candidate,
      isInterviewScheduled: candidate.interviews.length > 0, // Check if interview exists
    }));
  }

  async createCandidate(data: Prisma.CandidateCreateInput) {
    return this.prisma.candidate.create({
      data: {
        ...data,
        dob: new Date(data.dob),
        status: data.status || CandidateStatus.PENDING,
      },
    });
  }

  async updateCandidateStatus(
    id: string,
    status: 'HIRED' | 'PENDING' | 'REJECTED',
  ) {
    return this.prisma.$transaction(async (prisma) => {
      // Update the candidate's status
      const updatedCandidate = await prisma.candidate.update({
        where: { id },
        data: { status },
      });

      // If candidate is rejected, delete the associated interview (if exists)
      if (status === 'REJECTED') {
        await prisma.interview.deleteMany({
          where: { candidateId: id },
        });
      }

      return updatedCandidate;
    });
  }

  async scheduleInterview(candidateId: string, scheduledAt: string) {
    const parsedDate = new Date(scheduledAt);

    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format provided for scheduledAt');
    }

    return this.prisma.interview.create({
      data: {
        candidateId,
        mode: 'IN_PERSON',
        scheduledAt: parsedDate, // ✅ Ensure parsedDate is valid before storing
      },
    });
  }
}
