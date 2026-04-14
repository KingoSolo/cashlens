import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity.js';
import { TransactionsService } from './transactions.service.js';
import { TransactionsController } from './transactions.controller.js';
import { CsvParserService } from './csv-parser.service.js';
import { CategorizationService } from './categorization.service.js';
import { BusinessModule } from '../business/business.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), BusinessModule],
  providers: [TransactionsService, CsvParserService, CategorizationService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
