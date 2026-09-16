import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { Job, JobStatus } from '@prisma/client';

@Injectable()
export class JobsService {
     constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateJobDto): Promise<Job> {
    return this.prisma.job.create({
      data: {
        title: dto.title,
        type: dto.type,
        status: JobStatus.PENDING,
      },
    });
  }

  async findAll(): Promise<Job[]> {
    return this.prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
