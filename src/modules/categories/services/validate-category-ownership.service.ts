import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from 'src/shared/database/repositories/categories.repository';

@Injectable()
export class ValidateCategoryOwnershipService {
  constructor(private readonly categories_repository: CategoriesRepository) {}

  async validate(user_id: string, category_id: string) {
    const isOwner = await this.categories_repository.findFirst({
      userId: user_id,
      id: category_id,
    });

    if (!isOwner) {
      throw new NotFoundException('Category not found');
    }
  }
}
