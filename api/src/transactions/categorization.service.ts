import { Injectable } from '@nestjs/common';

@Injectable()
export class CategorizationService {
  categorize(description: string, type: string): string {
    if (type === 'income') return 'Revenue';

    const desc = description.toLowerCase();

    if (/rent|lease|office space|property/.test(desc)) return 'Rent';
    if (/salary|wage|staff|worker|employee|labour|labor|payroll|pay roll/.test(desc)) return 'Labour';
    if (/transport|delivery|dispatch|courier|logistics|shipping|freight|rider/.test(desc)) return 'Logistics';
    if (/electricity|water|internet|phone|utility|nepa|bill|generator|diesel|fuel/.test(desc)) return 'Utilities';
    if (/advert|marketing|promo|social media|instagram|facebook|flyer|banner/.test(desc)) return 'Marketing';
    if (/machine|equipment|tool|printer|laptop|computer|sewing|iron|blender/.test(desc)) return 'Equipment';
    if (/fabric|supplier|market|stock|goods|material|inventory|purchase|buy|bought|wholesale/.test(desc)) return 'Inventory';

    return 'Inventory';
  }
}
