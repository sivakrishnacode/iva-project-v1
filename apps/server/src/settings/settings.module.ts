import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { PrismaService } from '@/db/prisma.service';

@Module({
  imports: [],
  controllers: [SettingsController],
  providers: [SettingsService, PrismaService],
})
export class SettingsModule {}
