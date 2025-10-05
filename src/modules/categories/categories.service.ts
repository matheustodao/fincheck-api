import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from 'src/shared/database/repositories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly category_repository: CategoriesRepository) {}
  async findAllByUserId(user_id: string) {
    return await this.category_repository.findManyByUserId(user_id);
  }
}
