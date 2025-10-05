import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repository';
import { ValidateBankAccountsOwnershipService } from 'src/modules/bank-accounts/services/validate-bank-account-ownership.service';
import { ValidateCategoryOwnershipService } from 'src/modules/categories/services/validate-category-ownership.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transaction_repository: TransactionsRepository,
    private readonly bank_account_ownership: ValidateBankAccountsOwnershipService,
    private readonly category_ownership: ValidateCategoryOwnershipService,
  ) {}
  async create(user_id: string, create_transaction_dto: CreateTransactionDto) {
    const { bankAccountId, categoryId, amount, date, name, type } =
      create_transaction_dto;

    await this.validateEntitiesOwnership(user_id, {
      bankAccountId,
      categoryId,
    });

    return this.transaction_repository.create(user_id, {
      amount,
      bankAccountId,
      categoryId,
      date: new Date(date),
      name,
      type,
    });
  }

  async findAllByUserId(user_id: string) {
    const transactions =
      await this.transaction_repository.findManyByUserId(user_id);

    return transactions;
  }

  async update(
    user_id: string,
    transaction_id: string,
    update_transaction_dto: UpdateTransactionDto,
  ) {
    const { amount, bankAccountId, categoryId, date, name, type } =
      update_transaction_dto;

    await this.validateEntitiesOwnership(user_id, {
      bankAccountId,
      categoryId,
      transactionId: transaction_id,
    });

    return await this.transaction_repository.update(user_id, transaction_id, {
      amount,
      bankAccountId,
      categoryId,
      name,
      type,
      date: new Date(date),
    });
  }

  async remove(user_id: string, transaction_id) {
    return await this.transaction_repository.delete(user_id, transaction_id);
  }

  private async validateEntitiesOwnership(
    userId: string,
    entities: {
      categoryId: string;
      bankAccountId: string;
      transactionId?: string;
    },
  ) {
    const { bankAccountId, categoryId } = entities;

    await Promise.all([
      this.bank_account_ownership.validate(userId, bankAccountId),
      this.category_ownership.validate(userId, categoryId),
    ]);

    if (entities?.transactionId) {
      await this.transaction_repository.findFirst({
        id: entities.transactionId,
        userId,
      });
    }
  }
}
