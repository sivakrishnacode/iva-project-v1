import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class CandidateService {
  constructor(private prisma: PrismaService) {}

  async getAllCandidates() {
    return this.prisma.candidate.findMany();
  }

  async createCandidate(data: Prisma.CandidateCreateInput) {
    return this.prisma.candidate.create({ data });
  }
}
