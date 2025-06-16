import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { AccessToken } from 'src/auth/types/AccessToken';
import { RegisterRequestDto } from 'src/auth/dtos/RegisterRequestDto';
import { CreateUserDto } from 'src/user/dtos/CreateUserDto';
import { User } from 'generated/prisma';
import { InvitationService } from 'src/invitation/invitation.service';
import { AuthenticatedUser } from './dtos/AuthenticatedRequest';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private invitationService: InvitationService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid login');
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid login');
    }

    return user;
  }

  async login(authenticatedUser: AuthenticatedUser): Promise<AccessToken> {
    // Only include safe fields in the JWT payload
    return { accessToken: await this.jwtService.signAsync(authenticatedUser) };
  }

  async register(user: RegisterRequestDto) {
    this.logger.debug(`Attempting to register user: ${user.email}`);
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (existingUser) {
      this.logger.debug(`User with email ${user.email} already exists.`);
      throw new BadRequestException('User with this email already exists');
    }

    this.logger.debug(`Registering user: ${user.email}`);

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: CreateUserDto = { ...user, password: hashedPassword };
    const userEntity = await this.userService.create(newUser);

    const authenticatedUser: AuthenticatedUser = {
      id: userEntity.id,
      email: userEntity.email,
    };

    await this.invitationService.sendGroupInvitationIfNotSentItYet(
      authenticatedUser,
    );

    return this.login(authenticatedUser);
  }
}
