import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isPublic?: boolean;
}
