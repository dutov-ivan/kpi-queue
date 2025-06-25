import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GroupIdParamDto {
  @Type(() => Number)
  @ApiProperty()
  @IsNumber()
  id: number;
}
