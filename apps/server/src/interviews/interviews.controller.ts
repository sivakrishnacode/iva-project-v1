import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { InterviewService } from './interviews.service';
import { InterviewStatus } from '@prisma/client';

@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get()
  async getAllInterviews(
    @Query('status') status?: InterviewStatus,
    @Query('candidateId') candidateId?: string,
  ) {
    return this.interviewService.getAllInterviews(status, candidateId);
  }

  @Get('result')
  async result(@Query('candidateId') candidateId?: string) {
    return this.interviewService.getTestResult(candidateId);
  }

  @Post('submit')
  async submitInterview(
    @Body()
    submissionData: {
      candidateId: string;
      answers: { questionId: string; answer: string }[];
    },
  ) {
    return this.interviewService.submitInterview(submissionData);
  }

  @Delete(':id')
  async deleteInterview(@Param('id') id: string) {
    return this.interviewService.deleteInterview(id);
  }
}
