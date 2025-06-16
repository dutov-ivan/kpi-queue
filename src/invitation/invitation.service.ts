import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AuthenticatedUser } from 'src/auth/dtos/AuthenticatedRequest';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InvitationService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(InvitationService.name);

  async getInvitationsByEmail(email: string) {
    this.logger.debug(`Fetching invitations for email: ${email}`);
    const invitations = await this.prismaService.groupInvitation.findMany({
      where: { email },
    });
    return invitations;
  }

  async sendInvitationIfCan(email: string, groupId: number) {
    this.logger.debug(`Sending invitation to ${email} for group ${groupId}`);

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
        throw new BadRequestException(
          `User with email ${email} is already a participant in this group.`,
        );
      }
    }

    const existingInvitation =
      await this.prismaService.groupInvitation.findFirst({
        where: { email, groupId },
      });

    if (existingInvitation) {
      throw new BadRequestException(
        `Invitation already exists for ${email}, postponing.`,
      );
    }

    if (!user) {
      await this.prismaService.groupInvitation.create({
        data: {
          email,
          groupId,
        },
      });
      return;
    }

    await this.prismaService.groupInvitation.create({
      data: {
        email,
        groupId,
        userId: user.id,
      },
    });

    this.logger.debug(`Invitation sent to ${email}`);
  }

  async sendGroupInvitationIfNotSentItYet(user: AuthenticatedUser) {
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
}
