import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  async saveMany(transactions: Partial<Transaction>[]): Promise<Transaction[]> {
    const entities = this.transactionsRepository.create(transactions);
    return this.transactionsRepository.save(entities);
  }

  async findByBusiness(businessId: string): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { businessId },
      order: { date: 'ASC' },
    });
  }

  async deleteByBusiness(businessId: string): Promise<void> {
    await this.transactionsRepository.delete({ businessId });
  }
}
