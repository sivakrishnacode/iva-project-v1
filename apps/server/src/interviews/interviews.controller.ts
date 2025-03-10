import { Controller, Get, Delete, Param, Query } from '@nestjs/common';
import { InterviewService } from './interviews.service';
import { InterviewStatus } from '@prisma/client';

@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get()
  async getAllInterviews(@Query('status') status?: InterviewStatus) {
    return this.interviewService.getAllInterviews(status);
  }

  @Delete(':id')
  async deleteInterview(@Param('id') id: string) {
    return this.interviewService.deleteInterview(id);
  }
}
