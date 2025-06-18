import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { PrismaService } from 'src/prisma.service';
import { InvitationController } from './invitation.controller';
import { GroupsService } from 'src/groups/groups.service';
import { GroupInvitationSender } from './group-invitation-sender/group-invitation.sender';
import { QueueInvitationSender } from './queue-invitation-sender/queue-invitation.sender';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [],
  controllers: [InvitationController],
  providers: [
    InvitationService,
    GroupsService,
    UserService,
    PrismaService,
    GroupInvitationSender,
    QueueInvitationSender,
  ],
  exports: [InvitationService],
})
export class InvitationModule {}
