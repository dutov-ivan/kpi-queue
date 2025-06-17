import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from 'generated/prisma';
import { AuthenticatedUser } from 'src/auth/dtos/AuthenticatedRequest';
import { PrismaService } from 'src/prisma.service';
import { SendOptionsDto } from './dto/SendOptionsDto';

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

  private async getUserInvitationState(
    email: string,
    groupId: number,
  ): Promise<{
    state:
      | 'Not sent'
      | 'Already sent'
      | 'Already participant'
      | 'Not sent, user not registered';
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
      return { state: 'Not sent, user not registered', user: null };
    }

    return { state: 'Not sent', user };
  }

  // Returns the user if already invited or a participant, otherwise returns null
  async inviteUserToGroupAndGetIfInvited(
    email: string,
    groupId: number,
    sendOptionsDto: SendOptionsDto,
  ): Promise<User | null> {
    const { state, user } = await this.getUserInvitationState(email, groupId);
    const { shouldThrowOnAlreadyInvited, shouldThrowOnAlreadyParticipant } =
      sendOptionsDto;
    switch (state) {
      case 'Not sent': {
        await this.prismaService.groupInvitation.create({
          data: {
            email,
            groupId,
            userId: user!.id,
          },
        });

        this.logger.debug(`Invitation sent to ${email}`);
        return null;
      }
      case 'Already sent':
        this.logger.debug(
          `Invitation already sent to ${email} for group ${groupId}`,
        );
        if (shouldThrowOnAlreadyInvited) {
          throw new BadRequestException(
            `User with email ${email} is already invited to this group.`,
          );
        }
        return user;

      case 'Already participant':
        this.logger.debug(
          `User with email ${email} is already a participant in group ${groupId}`,
        );
        if (shouldThrowOnAlreadyParticipant) {
          throw new BadRequestException(
            `User with email ${email} is already a participant in this group.`,
          );
        }
        return user;

      case 'Not sent, user not registered':
        await this.prismaService.groupInvitation.create({
          data: {
            email,
            groupId,
          },
        });
        return null;
    }
  }

  async sendGroupInvitationOnRegistration(user: AuthenticatedUser) {
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
