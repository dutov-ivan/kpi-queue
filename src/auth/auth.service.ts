import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { AccessToken } from 'src/auth/types/AccessToken';
import { RegisterRequestDto } from 'src/auth/dtos/RegisterRequestDto';
import { CreateUserDto } from 'src/user/dtos/CreateUserDto';
import { AuthenticatedUser } from './dtos/AuthenticatedRequest';
import { User } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.userService.findOneByEmail(email);

    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid login');
    }

    return user;
  }

  async login(user: AuthenticatedUser): Promise<AccessToken> {
    return { accessToken: await this.jwtService.signAsync(user) };
  }

  async register(user: RegisterRequestDto) {
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: CreateUserDto = { ...user, password: hashedPassword };
    const userEntity = await this.userService.create(newUser);
    return this.login(userEntity);
  }
}
