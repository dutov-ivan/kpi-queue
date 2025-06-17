import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Group, Role } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';
import { CreateGroupDto } from './dto/CreateGroupDto';
import { UpdateGroupDto } from './dto/UpdateGroupDto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GroupsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}
  private readonly logger = new Logger(GroupsService.name);

  async ensureUserIsGroupAdmin(userId: number, groupId: number) {
    this.logger.debug(
      `Ensuring user ${userId} is an admin of group ${groupId}`,
    );

    const participant = await this.prismaService.groupParticipant.findFirst({
      where: {
        userId: userId,
        groupId,
        role: Role.Admin,
      },
    });

    if (!participant) {
      this.logger.warn(`User ${userId} is not an admin of group ${groupId}.`);
      throw new BadRequestException('User is not an admin of this group');
    }

    return participant;
  }

  async createGroup(ownerId: number, dto: CreateGroupDto): Promise<Group> {
    await this.userService.findOneById(ownerId);

    return this.prismaService.$transaction(async (tx) => {
      const newGroup = await tx.group.create({
        data: {
          name: dto.name,
          description: dto.description,
          isPublic: dto.isPublic,
        },
      });

      await tx.groupParticipant.create({
        data: {
          userId: ownerId,
          role: Role.Admin,
          groupId: newGroup.id,
        },
      });

      return newGroup;
    });
  }

  async getGroupById(id: number): Promise<Group | null> {
    return this.prismaService.group.findUnique({
      where: { id },
    });
  }

  async getGroupsByUserId(userId: number): Promise<Group[]> {
    const groups = await this.prismaService.groupParticipant.findMany({
      where: { userId },
      include: { group: true },
    });

    return groups.map((gp) => gp.group);
  }

  async getGroupParticipantByEmail(email: string, groupId: number) {
    const participant = await this.prismaService.groupParticipant.findFirst({
      where: {
        groupId,
        user: { email },
      },
    });

    if (!participant) {
      throw new BadRequestException(
        `No participant found with email ${email} in group ${groupId}`,
      );
    }

    return participant;
  }

  async updateGroup(ownerId: number, data: UpdateGroupDto): Promise<Group> {
    await this.ensureUserIsGroupAdmin(ownerId, data.id);
    const updatedGroup = await this.prismaService.group.update({
      where: { id: data.id },
      data,
    });

    return updatedGroup;
  }

  async deleteGroup(id: number, ownerId: number): Promise<Group> {
    await this.ensureUserIsGroupAdmin(ownerId, id);
    const deletedGroup = await this.prismaService.group.delete({
      where: { id },
    });

    return deletedGroup;
  }
}
