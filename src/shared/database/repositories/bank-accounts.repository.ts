import { PrismaService } from 'src/shared/database/prisma.service';
import { BankAccount } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { TransactionType } from 'src/modules/transactions/entities/transaction.entity';
import { BankAccountType } from 'src/modules/bank-accounts/entities/bank-account.entity';
import { ApiProperty } from '@nestjs/swagger';

export class BankAccountWithCurrentBalance
  implements Omit<BankAccount, 'type'>
{
  @ApiProperty({ description: 'Nome da conta bancária' })
  name: string;

  @ApiProperty({ description: 'ID único da conta bancária' })
  id: string;

  @ApiProperty({ description: 'ID do usuário proprietário da conta' })
  userId: string;

  @ApiProperty({ description: 'Saldo inicial da conta' })
  initialBalance: number;

  @ApiProperty({
    description: 'Tipo da conta bancária',
    enum: BankAccountType,
  })
  type: BankAccountType;

  @ApiProperty({ description: 'Cor da conta para identificação visual' })
  color: string;

  @ApiProperty({
    description: 'Saldo atual da conta (calculado com base nas transações)',
  })
  currentBalance: number;
}

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

  async findManyByUserId(
    userId: string,
  ): Promise<BankAccountWithCurrentBalance[]> {
    const bankAccounts = await this.prisma.bankAccount.findMany({
      where: {
        userId,
      },
      include: {
        transactions: {
          select: {
            amount: true,
            type: true,
          },
        },
      },
    });

    const bankAccountsWithCurrentBalance = bankAccounts.reduce<
      BankAccountWithCurrentBalance[]
    >((allBankAccounts, currentBankAccount) => {
      const currentBalance = currentBankAccount.transactions.reduce(
        (totalBalance, transaction) => {
          const typesWithMinus: TransactionType[] = [
            TransactionType.EXPENSE,
            TransactionType.TRANSFER,
          ];

          const type = transaction.type as TransactionType;

          const operator = typesWithMinus.indexOf(type) !== -1 ? '-' : '';

          const newBalance =
            totalBalance +
            Number.parseFloat(`${operator}${transaction.amount}`);

          totalBalance = newBalance;

          return totalBalance;
        },
        currentBankAccount.initialBalance,
      );

      allBankAccounts.push({
        currentBalance: Number.parseFloat(currentBalance.toFixed(2)),
        id: currentBankAccount.id,
        userId: currentBankAccount.userId,
        color: currentBankAccount.color,
        initialBalance: currentBankAccount.initialBalance,
        name: currentBankAccount.name,
        type: currentBankAccount.type as BankAccountType,
      });

      return allBankAccounts;
    }, []);

    return bankAccountsWithCurrentBalance ?? [];
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
