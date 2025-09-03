import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from 'src/shared/database/repositories/users.repository';
import bcrypt from 'node_modules/bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly user_repository: UsersRepository) {}
  async create(createUserDto: CreateUserDto) {
    const userExists = await this.user_repository.findByEmail(
      createUserDto.email,
    );

    if (userExists) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    await this.user_repository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return createUserDto;
  }
}
