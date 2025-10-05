import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repository';
import { ValidateBankAccountsOwnershipService } from './validate-bank-account-ownership.service';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly bank_account_repository: BankAccountsRepository,
    private readonly bank_account_ownership: ValidateBankAccountsOwnershipService,
  ) {}

  async create(user_id: string, createBankAccountDto: CreateBankAccountDto) {
    return await this.bank_account_repository.create(
      user_id,
      createBankAccountDto,
    );
  }

  async findAll(user_id: string) {
    return await this.bank_account_repository.findManyByUserId(user_id);
  }

  findOne(id: string) {
    return this.bank_account_repository.findById(id);
  }

  async update(
    user_id: string,
    bank_account_id: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    await this.bank_account_ownership.validate(user_id, bank_account_id);

    const bankAccount = await this.bank_account_repository.update(
      user_id,
      bank_account_id,
      updateBankAccountDto,
    );

    return bankAccount;
  }

  async remove(user_id: string, bank_account_id: string) {
    await this.bank_account_ownership.validate(user_id, bank_account_id);

    await this.bank_account_repository.delete(user_id, bank_account_id);
  }
}
