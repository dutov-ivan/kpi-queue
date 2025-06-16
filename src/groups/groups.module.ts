import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { PrismaService } from 'src/prisma.service';
import { GroupsController } from './groups.controller';
import { UserService } from 'src/user/user.service';
import { InvitationService } from 'src/invitation/invitation.service';

@Module({
  imports: [],
  controllers: [GroupsController],
  providers: [PrismaService, InvitationService, UserService, GroupsService],
  exports: [],
})
export class GroupsModule {}
