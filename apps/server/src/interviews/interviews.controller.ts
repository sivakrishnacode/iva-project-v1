import { Controller, Get, Delete, Param } from '@nestjs/common';
import { InterviewService } from './interviews.service';

@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get()
  async getAllInterviews() {
    return this.interviewService.getAllInterviews();
  }

  @Delete(':id')
  async deleteInterview(@Param('id') id: string) {
    return this.interviewService.deleteInterview(id);
  }
}
