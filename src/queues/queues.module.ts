import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { PrismaService } from 'src/prisma.service';
import { InvitationModule } from 'src/invitation/invitation.module';

@Module({
  imports: [InvitationModule],
  providers: [QueuesService, PrismaService],
  exports: [QueuesService],
})
export class QueuesModule {}
