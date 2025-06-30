import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Group, Role } from '@prisma/client';
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

  async checkIfUserIsGroupParticipant(
    userId: number,
    groupId: number,
  ): Promise<boolean> {
    const participant = await this.prismaService.groupParticipant.findFirst({
      where: {
        userId,
        groupId,
      },
    });

    return !!participant;
  }

  async checkIfUserIsGroupAdmin(userId: number, groupId: number) {
    const participant = await this.prismaService.groupParticipant.findFirst({
      where: {
        userId: userId,
        groupId,
        role: Role.Admin,
      },
    });

    if (!participant) {
      return null;
    }

    return participant;
  }

  async ensureUserIsGroupAdmin(userId: number, groupId: number) {
    const participant = await this.checkIfUserIsGroupAdmin(userId, groupId);
    if (!participant) {
      throw new BadRequestException(
        `User with ID ${userId} is not an admin of group with ID ${groupId}`,
      );
    }
    return participant;
  }

  async ensureUserIsGroupParticipant(
    userId: number,
    groupId: number,
  ): Promise<void> {
    const isParticipant = await this.checkIfUserIsGroupParticipant(
      userId,
      groupId,
    );
    if (!isParticipant) {
      throw new BadRequestException(
        `User with ID ${userId} is not a participant of group with ID ${groupId}`,
      );
    }
    return;
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

  async updateGroup(
    ownerId: number,
    groupId: number,
    data: UpdateGroupDto,
  ): Promise<Group> {
    await this.ensureUserIsGroupAdmin(ownerId, groupId);
    const updatedGroup = await this.prismaService.group.update({
      where: { id: groupId },
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
