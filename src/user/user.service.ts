import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUserDto';
import { PrismaService } from 'src/prisma.service';
import { User } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user === null) {
      throw new BadRequestException();
    }

    return user;
  }

  async create(createDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: createDto,
    });
  }
}
