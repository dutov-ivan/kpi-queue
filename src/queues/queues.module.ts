import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';
import { PrismaService } from 'src/prisma.service';
import { InvitationModule } from 'src/invitation/invitation.module';
import { GroupsModule } from 'src/groups/groups.module';

@Module({
  imports: [InvitationModule, GroupsModule],
  providers: [QueuesService, PrismaService],
  controllers: [QueuesController],
})
export class QueuesModule {}
