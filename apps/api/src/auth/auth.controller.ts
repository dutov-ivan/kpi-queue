import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginResponseDto } from './dtos/LoginResponseDto';
import { AuthenticatedRequest } from './dtos/AuthenticatedRequest';
import { RegisterRequestDto } from './dtos/RegisterRequestDto';
import { Public } from './decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Request() req: AuthenticatedRequest,
  ): Promise<LoginResponseDto | BadRequestException> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDto,
  ): Promise<LoginResponseDto | BadRequestException> {
    return this.authService.register(registerBody);
  }
}
