import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { QueueStartStrategy, QueueStepStrategy } from '@prisma/client';

export class CreateQueueDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  startedAt?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  startFromId?: number;

  @ApiProperty({ enum: QueueStartStrategy })
  @IsString()
  @IsEnum(QueueStartStrategy)
  startStrategy: QueueStartStrategy;

  @ApiProperty({ enum: QueueStepStrategy })
  @IsString()
  @IsEnum(QueueStepStrategy)
  stepStrategy: QueueStepStrategy;

  @ApiProperty()
  @IsArray()
  @IsEmail({}, { each: true })
  participantEmails: string[];
}
