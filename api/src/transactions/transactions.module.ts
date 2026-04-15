import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { CsvParserService } from './csv-parser.service';
import { CategorizationService } from './categorization.service';
import { BusinessModule } from '../business/business.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), BusinessModule],
  providers: [TransactionsService, CsvParserService, CategorizationService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
