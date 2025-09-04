import { PrismaService } from 'src/shared/database/prisma.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { Prisma, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        categories: {
          createMany: {
            data: this.categories_default(),
          },
        },
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user;
  }

  async findByEmailAndUserId(
    userId: string,
    email: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        AND: { id: userId },
      },
    });

    return user;
  }

  private categories_default(): Prisma.CategoryCreateManyUserInput[] {
    return [
      { name: 'Salário', icon: 'travel', type: 'EXPENSE' },
      { name: 'Alimentação', icon: 'food', type: 'EXPENSE' },
      { name: 'Transporte', icon: 'car', type: 'EXPENSE' },
      { name: 'Lazer', icon: 'party', type: 'EXPENSE' },
      { name: 'Saúde', icon: 'health', type: 'EXPENSE' },
      { name: 'Educação', icon: 'education', type: 'EXPENSE' },
      { name: 'Moradia', icon: 'home', type: 'EXPENSE' },
      { name: 'Outros', icon: 'other', type: 'EXPENSE' },
      { name: 'Salário', icon: 'salary', type: 'INCOME' },
      { name: 'Freelance', icon: 'freelance', type: 'INCOME' },
      { name: 'Investimentos', icon: 'investments', type: 'INCOME' },
      { name: 'Presentes', icon: 'gifts', type: 'INCOME' },
      { name: 'Outros', icon: 'other', type: 'INCOME' },
    ];
  }
}
