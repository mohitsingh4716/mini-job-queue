import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  type!: string;
}
