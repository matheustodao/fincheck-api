import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from './repositories/users.repository';

@Global()
@Module({
  providers: [UsersRepository, PrismaService],
  exports: [UsersRepository],
})
export class DatabaseModule {}
