import { Injectable } from '@nestjs/common';
import { GroupsService } from 'src/groups/groups.service';
import { PrismaService } from 'src/prisma.service';
import { CreateQueueDto } from './dto/CreateQueueDto';
import { InvitationService } from 'src/invitation/invitation.service';
import { QueueParticipant, User } from 'generated/prisma';

@Injectable()
export class QueuesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invitationService: InvitationService,
    private readonly groupService: GroupsService,
  ) {}
  async getAllQueuesForUser(userId: number) {
    return this.prisma.queue.findMany({
      where: {
        participants: {
          some: {
            groupParticipant: {
              userId: userId,
            },
          },
        },
      },
    });
  }

  async createQueue(data: CreateQueueDto, userId: number, groupId: number) {
    await this.groupService.ensureUserIsGroupAdmin(userId, groupId);

    const queue = await this.prisma.queue.create({
      data: {
        name: data.name,
        description: data.description,
        groupId: groupId,
      },
    });

    const { participantEmails, ...queueData } = data;

    const queueParticipants: QueueParticipant[] = [];

    for (let i = 0; i < participantEmails.length; i++) {
      const email = participantEmails[i];
      const user =
        await this.invitationService.inviteUserToGroupAndGetIfInvited(
          email,
          groupId,
          {
            shouldThrowOnAlreadyInvited: false,
            shouldThrowOnAlreadyParticipant: false,
          },
        );
      if (!user) {
        continue;
      }

      await this.prisma.queue;
    }

    return this.prisma.queue.create({
      data: {
        ...queueData,
        participants: {
          create: participants.map((participant) => ({
            groupParticipant: {
              connect: {
                id: participant.id,
              },
            },
          })),
        },
      },
    });
  }
}
