import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './business.entity.js';
import { BusinessService } from './business.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Business])],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
