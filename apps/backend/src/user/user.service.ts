import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUserDto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async create(createDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: createDto,
    });
  }
}
