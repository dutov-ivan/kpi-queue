import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'db/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/CreateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email,
    });

    if (user === null) {
      throw new BadRequestException();
    }

    return user;
  }

  async create(createDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(createDto);
  }
}
