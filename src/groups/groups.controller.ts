import { Body, Controller, Patch, Post } from '@nestjs/common';
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
}
