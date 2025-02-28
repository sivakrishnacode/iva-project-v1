import { Controller, Get, Post, Body } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CandidateService } from './canditate.service';

@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get()
  async getAllCandidates() {
    return this.candidateService.getAllCandidates();
  }

  @Post()
  async createCandidate(@Body() data: Prisma.CandidateCreateInput) {
    return this.candidateService.createCandidate(data);
  }
}
