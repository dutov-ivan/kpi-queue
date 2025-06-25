import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class QueueInvitationSender {
  constructor(private readonly prismaService: PrismaService) {}

  async sendToExistingUser(email: string, queueId: number, userId: number) {
    await this.prismaService.queueInvitation.create({
      data: {
        email,
        queueId,
        userId,
      },
    });
  }

  async sendToNewUser(email: string, queueId: number) {
    await this.prismaService.queueInvitation.create({
      data: {
        email,
        queueId,
      },
    });
  }
}
