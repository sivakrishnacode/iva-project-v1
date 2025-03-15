import { Injectable } from '@nestjs/common';
import { CandidateStatus, InterviewMode, Prisma } from '@prisma/client';
import { mkdir, writeFile } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class CandidateService {
  constructor(private prisma: PrismaService) {}

  async getAllCandidates(
    status?: 'HIRED' | 'PENDING' | 'REJECTED',
    email?: string,
  ) {
    const whereCondition: any = {};

    if (status) {
      whereCondition.status = status;
    }

    if (email) {
      whereCondition.email = email;
    }

    const candidates = await this.prisma.candidate.findMany({
      where: whereCondition,
      include: { interviews: true }, // Include interview details
    });

    return candidates.map((candidate) => ({
      ...candidate,
      isInterviewScheduled: candidate.interviews.length > 0, // Check if interview exists
    }));
  }

  async createCandidate(data: Prisma.CandidateCreateInput, file?: any) {
    let resumePath: string | null = null;

    if (file) {
      const uploadDir = join(__dirname, '..', '..', 'uploads', 'resumes');

      // Ensure directory exists
      await mkdir(
        uploadDir,
        { recursive: true } as { recursive: boolean },
        () => {},
      );

      // Create unique filename (timestamp + original name)
      const filename = `${Date.now()}-${file.originalname}`;
      const filePath = join(uploadDir, filename);

      // Save file to the server
      writeFile(filePath, file.buffer, (err) => {
        if (err) {
          throw new Error('Failed to save file');
        }
      });

      // Store path in DB
      resumePath = `/uploads/resumes/${filename}`;
    }

    const existingEmail = await this.prisma.candidate.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingEmail) {
      throw new Error('Email already exists');
    }

    return this.prisma.candidate.create({
      data: {
        address: data.address,
        password: `${data.firstName}@123`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        experience: Number(data.experience),
        testLink: '',
        dob: new Date(data.dob),
        status: data.status || CandidateStatus.PENDING,
        resume: resumePath, // Store file path
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

  async scheduleInterview(
    candidateId: string,
    scheduledAt: string,
    jobId: string,
    mode: InterviewMode,
  ) {
    const parsedDate = new Date(scheduledAt);

    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format provided for scheduledAt');
    }

    return this.prisma.interview.create({
      data: {
        candidateId,
        jobId,
        mode: mode,
        scheduledAt: parsedDate, // ✅ Ensuring the parsed date is valid before storing
      },
    });
  }
}
