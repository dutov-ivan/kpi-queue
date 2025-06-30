import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateQueueDto } from './dto/CreateQueueDto';
import { InvitationService } from 'src/invitation/invitation.service';

@Injectable()
export class QueuesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invitationService: InvitationService,
  ) {}

  async getQueuesForGroup(groupId: number) {
    return this.prisma.queue.findMany({
      where: { groupId },
    });
  }

  async getQueueById(id: number) {
    return this.prisma.queue.findUnique({
      where: { id },
    });
  }

  async ensureUserIsQueueParticipant(
    userId: number,
    queueId: number,
  ): Promise<void> {
    const participant = await this.prisma.queueParticipant.findFirst({
      where: {
        groupParticipant: {
          userId,
        },
        queueId,
      },
    });

    if (!participant) {
      throw new Error(
        `User with ID ${userId} is not a participant of queue with ID ${queueId}`,
      );
    }
  }

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
    const queue = await this.prisma.queue.create({
      data: {
        ...data,
        groupId,
      },
    });

    const { participantEmails } = data;

    for (let i = 0; i < participantEmails.length; i++) {
      const email = participantEmails[i];
      await this.invitationService.inviteToQueue(email, queue);
    }

    return queue;
  }
}
