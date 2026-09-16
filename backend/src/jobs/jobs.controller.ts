import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from '@prisma/client';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateJobDto): Promise<Job> {
    return this.jobsService.create(dto);
  }

  @Get()
  findAll(): Promise<Job[]> {
    return this.jobsService.findAll();
  }

 
}
