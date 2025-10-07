import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './services/transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ActiveUserId } from 'src/shared/decorators/active-user';
import { OptionalParseIntPipe } from 'src/shared/pipes/optional-parse-int-pipe';
import { OptionalParseUUIDPipe } from 'src/shared/pipes/optional-parse-uuid-pipe';
import { OptionalParseEnumPipe } from 'src/shared/pipes/optional-parse-enum-pipe';
import { TransactionType } from './entities/transaction.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @ActiveUserId() user_id: string,
    @Body() create_transaction_dto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(user_id, create_transaction_dto);
  }

  @Get()
  findAll(
    @ActiveUserId() user_id: string,
    @Query('month', OptionalParseIntPipe) month?: number,
    @Query('year', OptionalParseIntPipe) year?: number,
    @Query('bankAccountId', OptionalParseUUIDPipe)
    bank_account_id?: string,
    @Query('type', new OptionalParseEnumPipe(TransactionType))
    type?: TransactionType,
  ) {
    return this.transactionsService.findAllByUserId(user_id, {
      month,
      year,
      bankAccountId: bank_account_id,
      type,
    });
  }

  @Put(':transactionId')
  update(
    @ActiveUserId() user_id: string,
    @Param('transactionId', ParseUUIDPipe) transaction_id: string,
    @Body() update_transaction_dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(
      user_id,
      transaction_id,
      update_transaction_dto,
    );
  }

  @Delete(':transactionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @ActiveUserId() user_id: string,
    @Param('transactionId', ParseUUIDPipe) transaction_id: string,
  ) {
    return this.transactionsService.remove(user_id, transaction_id);
  }
}
