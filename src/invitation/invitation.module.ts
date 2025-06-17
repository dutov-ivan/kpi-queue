import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { PrismaService } from 'src/prisma.service';
import { InvitationController } from './invitation.controller';
import { GroupsService } from 'src/groups/groups.service';

@Module({
  imports: [],
  controllers: [InvitationController],
  providers: [InvitationService, GroupsService, PrismaService],
  exports: [InvitationService],
})
export class InvitationModule {}
