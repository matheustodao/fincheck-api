import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticateUserDTO } from './dto/authenticate.dto';
import { UsersRepository } from 'src/shared/database/repositories/users.repository';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly users_repository: UsersRepository) {}
  async authenticate(payload: AuthenticateUserDTO) {
    const { email, password } = payload;

    const user = await this.users_repository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      token: '',
      message: 'User authenticated successfully',
    };
  }
}
