import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthenticatedUser } from 'src/auth/dtos/AuthenticatedRequest';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GroupInvitationSender {
  constructor(private readonly prismaService: PrismaService) {}

  async sendToExistingUser(email: string, groupId: number, userId: number) {
    await this.prismaService.groupInvitation.create({
      data: {
        email,
        groupId,
        userId,
      },
    });
  }

  async sendToNewUser(email: string, groupId: number) {
    await this.prismaService.groupInvitation.create({
      data: {
        email,
        groupId,
      },
    });
  }

  async updateInvitationStatus(user: AuthenticatedUser) {
    const existingInvitation =
      await this.prismaService.groupInvitation.findFirst({
        where: { email: user.email },
      });

    if (!existingInvitation) {
      return;
    }
    await this.prismaService.groupInvitation.updateMany({
      where: { email: user.email },
      data: {
        userId: user.id,
      },
    });
  }

  public async send(
    email: string,
    groupId: number,
  ): Promise<{
    state:
      | 'Just sent'
      | 'Already sent'
      | 'Already participant'
      | 'Just sent, user not registered';
    user: User | null;
  }> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (user) {
      const participant = await this.prismaService.groupParticipant.findUnique({
        where: {
          userId_groupId: {
            userId: user.id,
            groupId,
          },
        },
      });
      if (participant) {
        return { state: 'Already participant', user };
      }
    }

    const existingInvitation =
      await this.prismaService.groupInvitation.findFirst({
        where: { email, groupId },
      });

    if (existingInvitation) {
      return { state: 'Already sent', user };
    }

    if (!user) {
      await this.sendToNewUser(email, groupId);
      return { state: 'Just sent, user not registered', user: null };
    }

    await this.sendToExistingUser(email, groupId, user.id);

    return { state: 'Just sent', user };
  }
}
