import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Business } from '../business/business.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @Column()
  date: string;

  @Column()
  description: string;

  @Column('float')
  amount: number;

  @Column()
  type: string;

  @Column()
  category: string;

  @CreateDateColumn()
  createdAt: Date;
}
