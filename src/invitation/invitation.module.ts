import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [InvitationService, PrismaService],
  exports: [InvitationService],
})
export class InvitationModule {}
