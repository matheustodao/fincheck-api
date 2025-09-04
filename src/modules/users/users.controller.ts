import {
  Controller,
  Post,
  Body,
  Get,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ActiveUser } from 'src/shared/decorators/active-user';
import type { IJwtAccessToken } from 'src/types/jwt-access-token';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  findMe(@ActiveUser() user: IJwtAccessToken) {
    const email: string = user.email;
    const userId: string = user.sub;

    if (!email?.trim() || !userId?.trim()) {
      throw new UnauthorizedException('Authentication token is missing');
    }

    return this.usersService.findMe(userId, email);
  }
}
