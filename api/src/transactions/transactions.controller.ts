import { Controller, Post, Get, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { TransactionsService } from './transactions.service';
import { CsvParserService } from './csv-parser.service';
import { CategorizationService } from './categorization.service';
import { BusinessService } from '../business/business.service';
import { UploadDto } from './dto/upload.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly csvParserService: CsvParserService,
    private readonly categorizationService: CategorizationService,
    private readonly businessService: BusinessService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadDto,
  ): Promise<{ businessId: string; businessName: string; transactionCount: number }> {
    const rows = this.csvParserService.parseBuffer(file.buffer);
    const business = await this.businessService.create(body.businessName);

    const transactions = rows.map((row) => ({
      businessId: business.id,
      date: row.date,
      description: row.description,
      amount: row.amount,
      type: row.type,
      category: this.categorizationService.categorize(row.description, row.type),
    }));

    await this.transactionsService.saveMany(transactions);

    return {
      businessId: business.id,
      businessName: business.name,
      transactionCount: transactions.length,
    };
  }

  @Get(':businessId')
  async findByBusiness(@Param('businessId') businessId: string) {
    await this.businessService.findById(businessId);
    return this.transactionsService.findByBusiness(businessId);
  }
}
