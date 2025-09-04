import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from 'src/shared/database/repositories/users.repository';
import bcrypt from 'node_modules/bcryptjs';
import { User } from '@prisma/client';

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

    const userCreated: User = await this.user_repository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return userCreated;
  }

  async findMe(userId: string, email: string) {
    const user = await this.user_repository.findByEmailAndUserId(userId, email);

    if (!user) {
      throw new ConflictException('User not found');
    }

    return {
      ...user,
      password: undefined,
    };
  }
}
