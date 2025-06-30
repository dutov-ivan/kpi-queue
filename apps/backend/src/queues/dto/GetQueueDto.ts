import { ApiProperty } from '@nestjs/swagger';
import { QueueStartStrategy, QueueStepStrategy } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class GetQueueDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  startStrategy: QueueStartStrategy;

  @ApiProperty()
  stepStrategy: QueueStepStrategy;
}
