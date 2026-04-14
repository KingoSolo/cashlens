import { Injectable, BadRequestException } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export interface ParsedRow {
  date: string;
  description: string;
  amount: number;
  type: string;
}

@Injectable()
export class CsvParserService {
  parseBuffer(buffer: Buffer): ParsedRow[] {
    const records = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    const rows: ParsedRow[] = [];

    for (const record of records) {
      const rawDate = record['date'];
      const rawAmount = record['amount'];
      const description = record['description'] ?? '';
      const type = record['type'];

      if (!rawDate || !rawAmount) continue;

      const date = this.normalizeDate(rawDate);
      if (!date) continue;

      const amount = parseFloat(rawAmount);
      if (isNaN(amount)) continue;

      rows.push({
        date,
        description,
        amount,
        type: (type ?? 'expense').toLowerCase(),
      });
    }

    if (rows.length === 0) {
      throw new BadRequestException('CSV file appears to be empty');
    }

    return rows;
  }

  private normalizeDate(raw: string): string | null {
    const formats = ['YYYY-MM-DD', 'DD/MM/YYYY', 'D MMM YYYY', 'MMM D, YYYY'];
    for (const fmt of formats) {
      const d = dayjs(raw, fmt, true);
      if (d.isValid()) return d.format('YYYY-MM-DD');
    }
    return null;
  }
}
