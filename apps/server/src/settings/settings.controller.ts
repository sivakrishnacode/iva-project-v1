import { Controller, Post, Body, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Prisma } from '@prisma/client';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  //Get jobs
  @Get('/jobs')
  getJobs() {
    return this.settingsService.getJobs();
  }

  // ✅ Create a new job
  @Post('/jobs')
  createJob(@Body() data: Prisma.JobCreateInput) {
    return this.settingsService.createJob(data);
  }

  // ✅ Create an Job question for a job
  @Post('/job-questions')
  createJobQuestion(@Body() data: Prisma.JobQuestionCreateInput) {
    return this.settingsService.createJobQuestion(data);
  }
}
