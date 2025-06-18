import { Injectable } from '@nestjs/common';
import { GroupsService } from 'src/groups/groups.service';
import { PrismaService } from 'src/prisma.service';
import { CreateQueueDto } from './dto/CreateQueueDto';
import { InvitationService } from 'src/invitation/invitation.service';

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
