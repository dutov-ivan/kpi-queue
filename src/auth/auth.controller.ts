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
import { RegisterRequestDto } from './dtos/RegisterRequestDto';
import { Public } from './decorators/public.decorator';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<LoginResponseDto | BadRequestException> {
    const user = await this.authService.validateUser(email, password);
    return this.authService.login(user);
  }

  @Post('register')
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(
    @Body() registerBody: RegisterRequestDto,
  ): Promise<LoginResponseDto | BadRequestException> {
    return this.authService.register(registerBody);
  }
}
