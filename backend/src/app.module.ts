import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { JobsModule } from './jobs/jobs.module';
import { HealthController } from './health.controller';

@Module({
  imports: [PrismaModule, JobsModule],
  controllers: [HealthController],
})
export class AppModule {}
