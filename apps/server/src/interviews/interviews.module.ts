import { PrismaService } from '@/db/prisma.service';
import { InterviewController } from './interviews.controller';
import { InterviewService } from './interviews.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [InterviewController],
  providers: [InterviewService, PrismaService],
})
export class InterviewModule {}
