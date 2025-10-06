import { PrismaService } from 'src/shared/database/prisma.service';
import { Transaction, TransactionType } from '@prisma/client';
import { Injectable } from '@nestjs/common';

export class TransactionFilterParams {
  month?: number;
  year?: number;
  bankAccountId?: string;
  type?: TransactionType;
}

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    transaction: Pick<
      Transaction,
      'amount' | 'bankAccountId' | 'categoryId' | 'date' | 'name' | 'type'
    >,
  ) {
    const { amount, bankAccountId, categoryId, date, name, type } = transaction;

    const createdTransaction = await this.prisma.transaction.create({
      data: {
        userId: userId,
        amount,
        bankAccountId,
        categoryId,
        date,
        name,
        type,
      },
    });

    return createdTransaction;
  }

  async findManyByUserId(
    userId: string,
    filter?: TransactionFilterParams,
  ): Promise<Transaction[]> {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const safeYear = filter?.year ? filter?.year : currentYear;
    const safeMonth = filter?.month ? filter.month : currentMonth;

    const isDateFilter =
      typeof filter?.month === 'number' || typeof filter?.year === 'number';

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: isDateFilter
          ? {
              gte: new Date(Date.UTC(safeYear, safeMonth)),
              lt: new Date(Date.UTC(safeYear, safeMonth + 1)),
            }
          : undefined,
        bankAccountId: this.handleFilter(filter?.bankAccountId),
        type: this.handleFilter(filter?.type),
      },
      orderBy: { date: 'desc' },
    });

    return transactions ?? [];
  }

  async findById(transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });

    return transaction;
  }

  async findFirst(transaction: Partial<Transaction>) {
    const { amount, id, bankAccountId, categoryId, date, name, type, userId } =
      transaction;

    const foundFirstTransaction = await this.prisma.transaction.findFirst({
      where: {
        amount,
        id,
        bankAccountId,
        categoryId,
        date,
        name,
        type,
        userId,
      },
    });

    return foundFirstTransaction;
  }

  async update(
    userId: string,
    transactionId: string,
    transaction: Pick<
      Transaction,
      'amount' | 'bankAccountId' | 'categoryId' | 'date' | 'name' | 'type'
    >,
  ) {
    const { amount, bankAccountId, categoryId, date, name, type } = transaction;

    const updateBankAccount = await this.prisma.transaction.update({
      where: {
        id: transactionId,
        userId: userId,
      },
      data: {
        userId: userId,
        amount,
        bankAccountId,
        categoryId,
        date,
        name,
        type,
      },
    });

    return updateBankAccount;
  }

  async delete(userId: string, transactionId: string) {
    await this.prisma.transaction.delete({
      where: {
        userId: userId,
        id: transactionId,
      },
    });
  }

  private handleFilter<T = any>(
    value: T | undefined,
    condition: boolean = true,
  ): T | undefined {
    if (typeof value === 'undefined' || !value || !condition) {
      return undefined;
    }

    return value;
  }
}
