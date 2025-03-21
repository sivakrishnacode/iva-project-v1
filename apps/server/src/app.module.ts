import { SettingsModule } from './settings/settings.module';
import { InterviewModule } from './interviews/interviews.module';
import { CandidateModule } from './candidate/candidate.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [SettingsModule, InterviewModule, CandidateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
