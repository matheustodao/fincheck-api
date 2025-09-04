import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticateUserDTO } from './dto/authenticate.dto';
import { UsersRepository } from 'src/shared/database/repositories/users.repository';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { IJwtAccessToken } from 'src/types/jwt-access-token';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users_repository: UsersRepository,
    private user_service: UsersService,
    readonly jwt_service: JwtService,
  ) {}
  async authenticate(payload: AuthenticateUserDTO) {
    const { email, password } = payload;

    const user = await this.users_repository.findByEmail(email);

    if (!user || !password?.trim()) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken(user);

    return {
      token: accessToken,
      message: 'User authenticated successfully',
    };
  }

  async signup(payload: CreateUserDto) {
    const user = await this.user_service.create(payload);

    const accessToken = await this.generateAccessToken(user);

    return {
      token: accessToken,
      message: 'User authenticated successfully',
    };
  }

  async generateAccessToken(user: User) {
    const payload: IJwtAccessToken = {
      sub: user.id,
      username: user.name,
      email: user.email,
    };

    return await this.jwt_service.signAsync(payload);
  }
}
