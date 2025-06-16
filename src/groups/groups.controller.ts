import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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
import { GetGroupInvitationDto } from './dto/GetGroupInvitationDto';
import { InvitationDetailsDto } from './dto/InvitationDetailsDto';
import { GroupIdParamDto } from './dto/GroupIdParamDto';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

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

  @Patch()
  @ApiOkResponse({
    description: 'Group updated successfully',
    type: UpdateGroupDto,
  })
  async updateGroup(
    @User() userInfo: AuthenticatedUser,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.updateGroup(userInfo.id, updateGroupDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'List of groups of the current user',
    type: [CreateGroupDto],
  })
  async getGroups(@User() userInfo: AuthenticatedUser) {
    return await this.groupsService.getGroupsByUserId(userInfo.id);
  }

  @Get('invitations')
  @ApiOkResponse({
    description: 'List of group invitations for the current user',
    type: [GetGroupInvitationDto],
  })
  async getGroupInvitations(@User() userInfo: AuthenticatedUser) {
    return await this.groupsService.getGroupInvitationsByEmail(userInfo.email);
  }

  @Post(':groupId/invite')
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
    return await this.groupsService.inviteParticipant(
      userInfo.id,
      params.groupId,
      dto.email,
    );
  }
}
