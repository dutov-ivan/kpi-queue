import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthenticatedUser } from 'src/auth/dtos/AuthenticatedRequest';
import { GetGroupInvitationDto } from 'src/invitation/dto/GetGroupInvitationDto';
import { InvitationService } from './invitation.service';
import { GroupIdParamDto } from 'src/invitation/dto/GroupIdParamDto';
import { InvitationDetailsDto } from 'src/invitation/dto/InvitationDetailsDto';
import { GroupsService } from 'src/groups/groups.service';

@Controller('invitation')
export class InvitationController {
  constructor(
    private readonly invitationService: InvitationService,
    private readonly groupService: GroupsService,
  ) {}
  @Post('group/:groupId')
  @ApiCreatedResponse({
    description: 'Invite sent successfully',
    type: GetGroupInvitationDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async inviteUserToGroup(
    @User() userInfo: AuthenticatedUser,
    @Param() params: GroupIdParamDto,
    @Query() dto: InvitationDetailsDto,
  ) {
    const { groupId } = params;
    const { id: ownerId } = userInfo;
    const { email } = dto;

    await this.groupService.ensureUserIsGroupAdmin(ownerId, groupId);
    return await this.invitationService.inviteUserToGroupAndGetIfInvited(
      email,
      groupId,
      {
        shouldThrowOnAlreadyInvited: true,
        shouldThrowOnAlreadyParticipant: true,
      },
    );
  }

  @Get('group')
  @ApiOkResponse({
    description: 'List of group invitations for the current user',
    type: [GetGroupInvitationDto],
  })
  async getGroupInvitations(@User() userInfo: AuthenticatedUser) {
    return await this.invitationService.getInvitationsByEmail(userInfo.email);
  }
}
