import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GroupIdParamDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  groupId: number;
}
