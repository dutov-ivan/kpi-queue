import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { PrismaService } from 'src/prisma.service';
import { GroupsController } from './groups.controller';
import { UserService } from 'src/user/user.service';
import { InvitationModule } from 'src/invitation/invitation.module';
import { QueuesModule } from 'src/queues/queues.module';

@Module({
  imports: [InvitationModule, QueuesModule],
  controllers: [GroupsController],
  providers: [PrismaService, UserService, GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
