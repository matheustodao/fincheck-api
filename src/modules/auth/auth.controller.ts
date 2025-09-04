import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticateUserDTO } from './dto/authenticate.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { IsPublic } from '../../shared/decorators/is-public';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @IsPublic()
  @Post('signin')
  authenticate(@Body() body: AuthenticateUserDTO) {
    return this.authService.authenticate(body);
  }

  @IsPublic()
  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }
}
