import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dtos/LoginResponseDto';
import { RegisterRequestDto } from './dtos/RegisterRequestDto';
import { Public } from './decorators/public.decorator';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginRequestDto } from './dtos/LoginRequestDto';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  async login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
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
