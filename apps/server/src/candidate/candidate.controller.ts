import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CandidateService } from './canditate.service';

@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get()
  async getAllCandidates(
    @Query('status') status?: 'HIRED' | 'PENDING' | 'REJECTED',
  ) {
    return this.candidateService.getAllCandidates(status);
  }

  @Post()
  async createCandidate(@Body() data: Prisma.CandidateCreateInput) {
    return this.candidateService.createCandidate(data);
  }

  @Post(':id/status')
  async updateCandidateStatus(
    @Param('id') id: string,
    @Body('status') status: 'HIRED' | 'PENDING' | 'REJECTED',
  ) {
    return this.candidateService.updateCandidateStatus(id, status);
  }

  @Post(':id/new-interview')
  async scheduleInterview(
    @Param('id') id: string,
    @Body('scheduledAt') scheduledAt: string,
  ) {
    return this.candidateService.scheduleInterview(id, scheduledAt);
  }
}
