import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateGroupDto } from './dto/CreateGroupDto';
import { GroupsService } from './groups.service';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthenticatedUser } from 'src/auth/dtos/AuthenticatedRequest';
import { UpdateGroupDto } from './dto/UpdateGroupDto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GroupIdParamDto } from './dto/GroupIdParamDto';
import { InvitationService } from 'src/invitation/invitation.service';
import { GetGroupInvitationDto } from './dto/invitation/GetGroupInvitationDto';
import { InvitationDetailsDto } from 'src/invitation/dto/InvitationDetailsDto';
import { QueuesService } from 'src/queues/queues.service';
import { GetQueueDto } from 'src/queues/dto/GetQueueDto';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly invitationService: InvitationService,
    private readonly queueService: QueuesService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Group created successfully',
    type: CreateGroupDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async createGroup(
    @User() userInfo: AuthenticatedUser,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return this.groupsService.createGroup(userInfo.id, createGroupDto);
  }

  @Patch('/:groupId')
  @ApiOkResponse({
    description: 'Group updated successfully',
    type: UpdateGroupDto,
  })
  async updateGroup(
    @Param() params: GroupIdParamDto,
    @User() userInfo: AuthenticatedUser,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.updateGroup(
      userInfo.id,
      params.id,
      updateGroupDto,
    );
  }

  @Post('/:groupId/invite')
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
    @Body() dto: InvitationDetailsDto,
  ) {
    const { id: groupId } = params;
    const { id: ownerId } = userInfo;
    const { email } = dto;

    await this.groupsService.ensureUserIsGroupAdmin(ownerId, groupId);
    return await this.invitationService.inviteUserToGroupAndGetIfInvited(
      email,
      groupId,
      {
        shouldThrowOnAlreadyInvited: true,
        shouldThrowOnAlreadyParticipant: true,
      },
    );
  }

  @Get('/:groupId/invite')
  @ApiOkResponse({
    description: 'List of group invitations for the current user',
    type: [GetGroupInvitationDto],
  })
  async getMyGroupInvitations(@User() userInfo: AuthenticatedUser) {
    return await this.invitationService.getInvitationsByEmail(userInfo.email);
  }

  @Get('/:groupId/queues')
  @ApiOkResponse({
    description: 'List of queues in the group',
    type: [GetQueueDto],
  })
  async getGroupQueues(
    @Param() params: GroupIdParamDto,
    @User() userInfo: AuthenticatedUser,
  ) {
    const { id: groupId } = params;
    await this.groupsService.ensureUserIsGroupParticipant(userInfo.id, groupId);
    return await this.queueService.getQueuesForGroup(groupId);
  }

  @Get('/:groupId/queues/:queueId')
  @ApiOkResponse({
    description: 'Get a specific queue in the group',
    type: GetQueueDto,
  })
  async getGroupQueueById(
    @Param() params: GroupIdParamDto & { queueId: number },
    @User() userInfo: AuthenticatedUser,
  ) {
    const { id: groupId, queueId } = params;
    await this.queueService.ensureUserIsQueueParticipant(userInfo.id, queueId);
  }

  @Get()
  @ApiOkResponse({
    description: 'List of groups of the current user',
    type: [CreateGroupDto],
  })
  async getGroups(@User() userInfo: AuthenticatedUser) {
    return await this.groupsService.getGroupsByUserId(userInfo.id);
  }
}
