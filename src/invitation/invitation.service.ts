import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Queue, User } from '@prisma/client';
import { AuthenticatedUser } from 'src/auth/dtos/AuthenticatedRequest';
import { PrismaService } from 'src/prisma.service';
import { SendOptionsDto } from './dto/SendOptionsDto';
import { GroupInvitationSender } from './group-invitation-sender/group-invitation.sender';
import { QueueInvitationSender } from './queue-invitation-sender/queue-invitation.sender';
import { GroupsService } from 'src/groups/groups.service';

@Injectable()
export class InvitationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly groupService: GroupsService,
    private readonly groupSender: GroupInvitationSender,
    private readonly queueSender: QueueInvitationSender,
  ) {}
  private readonly logger = new Logger(InvitationService.name);

  async getInvitationsByEmail(email: string) {
    this.logger.debug(`Fetching invitations for email: ${email}`);
    const invitations = await this.prismaService.groupInvitation.findMany({
      where: { email },
    });
    return invitations;
  }

  async inviteToQueue(email: string, queue: Queue) {
    // Check if the user is already invited to the queue
    const existingInvitation =
      await this.prismaService.queueInvitation.findFirst({
        where: { email, queueId: queue.id },
      });

    if (existingInvitation) {
      this.logger.warn(
        `User with email ${email} is already invited to queue ${queue.id}`,
      );
      return existingInvitation;
    }

    // Check if the user already exists
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      await this.groupSender.sendToNewUser(email, queue.groupId);
      await this.queueSender.sendToNewUser(email, queue.id);
      return;
    }

    // Check if the user is the participant of the group
    const isParticipant = await this.groupService.checkIfUserIsGroupParticipant(
      user.id,
      queue.groupId,
    );

    if (!isParticipant) {
      await this.groupSender.sendToExistingUser(email, queue.groupId, user.id);
      await this.queueSender.sendToExistingUser(email, queue.id, user.id);
      return;
    }

    // The user doesn't have invitation yet, so we send one
    await this.queueSender.sendToExistingUser(email, queue.id, user.id);
  }

  // Returns the user if already invited or a participant, otherwise returns null
  async inviteUserToGroupAndGetIfInvited(
    email: string,
    groupId: number,
    sendOptionsDto: SendOptionsDto,
  ): Promise<User | null> {
    const { state, user } = await this.groupSender.send(email, groupId);
    const { shouldThrowOnAlreadyInvited, shouldThrowOnAlreadyParticipant } =
      sendOptionsDto;
    switch (state) {
      case 'Just sent': {
        return null;
      }
      case 'Already sent':
        if (shouldThrowOnAlreadyInvited) {
          throw new BadRequestException(
            `User with email ${email} is already invited to this group.`,
          );
        }
        return user;

      case 'Already participant':
        if (shouldThrowOnAlreadyParticipant) {
          throw new BadRequestException(
            `User with email ${email} is already a participant in this group.`,
          );
        }
        return user;

      case 'Just sent, user not registered':
        return null;
    }
  }

  async handleRegister(user: AuthenticatedUser) {
    await this.groupSender.updateInvitationStatus(user);
  }
}
