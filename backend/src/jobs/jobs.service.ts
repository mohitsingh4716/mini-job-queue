import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { Job, JobStatus } from '@prisma/client';


const ALLOWED_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  [JobStatus.PENDING]: [JobStatus.RUNNING, JobStatus.FAILED],
  [JobStatus.RUNNING]: [JobStatus.COMPLETED],
  [JobStatus.COMPLETED]: [],
  [JobStatus.FAILED]: [],
};

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

  async updateStatus(id: string, newStatus: JobStatus): Promise<Job> {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with id "${id}" not found`);
    }

    const allowed = ALLOWED_TRANSITIONS[job.status];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${job.status} to ${newStatus}`,
      );
    }

   
    const result = await this.prisma.job.updateMany({
      where: { id, status: job.status },
      data: { status: newStatus },
    });

    if (result.count === 0) {
      throw new ConflictException(
        `Job status changed concurrently; transition to ${newStatus} is no longer valid`,
      );
    }

    return this.prisma.job.findUniqueOrThrow({ where: { id } });
  }

  async remove(id: string): Promise<{ id: string; deleted: true }> {
    
    const result = await this.prisma.job.deleteMany({ where: { id } });
    if (result.count === 0) {
      throw new NotFoundException(`Job with id "${id}" not found`);
    }
    return { id, deleted: true };
  }
}
