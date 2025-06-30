import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupInvitationDto {
  @ApiProperty({
    description: 'The email of the user to invite to the group',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The ID of the group to invite the user to',
    example: 1,
  })
  groupId: number;
}
