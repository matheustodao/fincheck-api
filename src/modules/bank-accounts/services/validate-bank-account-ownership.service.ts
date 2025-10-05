import { Injectable, NotFoundException } from '@nestjs/common';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repository';

@Injectable()
export class ValidateBankAccountsOwnershipService {
  constructor(
    private readonly bank_account_repository: BankAccountsRepository,
  ) {}

  async validate(user_id: string, bank_account_id: string) {
    const isOwner = await this.bank_account_repository.findFirst({
      userId: user_id,
      id: bank_account_id,
    });

    if (!isOwner) {
      throw new NotFoundException('Bank account not found');
    }
  }
}
