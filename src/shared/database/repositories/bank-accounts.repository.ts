import { PrismaService } from 'src/shared/database/prisma.service';
import { BankAccount } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BankAccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    bankAccount: Pick<
      BankAccount,
      'color' | 'initialBalance' | 'name' | 'type'
    >,
  ) {
    const { color, initialBalance, name, type } = bankAccount;
    const newBankAccount = await this.prisma.bankAccount.create({
      data: {
        color,
        initialBalance,
        name,
        type,
        userId,
      },
    });

    return newBankAccount;
  }

  async findManyByUserId(userId: string): Promise<BankAccount[]> {
    const bankAccounts = await this.prisma.bankAccount.findMany({
      where: {
        userId,
      },
    });

    return bankAccounts ?? [];
  }

  async findById(bankAccountId: string) {
    const bankAccount = await this.prisma.bankAccount.findUnique({
      where: {
        id: bankAccountId,
      },
    });

    return bankAccount;
  }

  async findFirst(bankAccount: Partial<BankAccount>) {
    const { color, id, initialBalance, name, type, userId } = bankAccount;

    const foundFirstBankAccount = await this.prisma.bankAccount.findFirst({
      where: {
        color,
        id,
        initialBalance,
        name,
        type,
        userId,
      },
    });

    return foundFirstBankAccount;
  }

  async update(
    userId: string,
    bankAccountId: string,
    bankAccount: Pick<
      BankAccount,
      'color' | 'initialBalance' | 'name' | 'type'
    >,
  ) {
    const { color, initialBalance, name, type } = bankAccount;

    const updateBankAccount = await this.prisma.bankAccount.update({
      where: {
        userId,
        id: bankAccountId,
      },
      data: {
        color,
        initialBalance,
        name,
        type,
      },
    });

    return updateBankAccount;
  }

  async delete(user_id: string, bank_account_id: string) {
    await this.prisma.bankAccount.delete({
      where: {
        userId: user_id,
        id: bank_account_id,
      },
    });
  }
}
