import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InterviewMode, Prisma } from '@prisma/client';
import { CandidateService } from './canditate.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get()
  async getAllCandidates(
    @Query('status') status?: 'HIRED' | 'PENDING' | 'REJECTED',
    @Query('email') email?: string, // Accept email as an optional query parameter
  ) {
    return this.candidateService.getAllCandidates(status);
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('resume'))
  async createCandidate(
    @Body() data: Prisma.CandidateCreateInput,
    @UploadedFile() file: any,
  ) {
    return this.candidateService.createCandidate(data, file);
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
    @Body('jobId') jobId: string,
    @Body('mode') mode: InterviewMode,
  ) {
    return this.candidateService.scheduleInterview(
      id,
      scheduledAt,
      jobId,
      mode,
    );
  }
}
