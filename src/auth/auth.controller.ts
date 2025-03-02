import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../shared/decorators/public.decorator';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: LoginResponseDto,
  })
  async login(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginRequestDto);
  }
}
