import { ApiProperty } from '@nestjs/swagger';

export class GetGroupInvitationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  groupId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  isAccepted: boolean;
}
