import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  isPublic: boolean;
}
