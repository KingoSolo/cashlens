import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './business.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async create(name: string): Promise<Business> {
    const business = this.businessRepository.create({ name });
    return this.businessRepository.save(business);
  }

  async findById(id: string): Promise<Business> {
    const business = await this.businessRepository.findOneBy({ id });
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    return business;
  }
}
