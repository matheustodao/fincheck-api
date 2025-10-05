import { PrismaService } from 'src/shared/database/prisma.service';
import { Category } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findManyByUserId(userId: string): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        userId,
      },
    });

    return categories ?? [];
  }
}
