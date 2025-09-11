import { Invoice } from '../../types';

export class InvoiceEntity implements Invoice {
  id: number;
  customer_id: number | null;
  finalized: boolean;
  paid: boolean;
  date: string | null;
  deadline: string | null;
  total: string | null;
  tax: string | null;
  invoice_lines: any[]; // Simplified
  customer?: any;

  constructor(data: Invoice) {
    this.id = data.id;
    this.customer_id = data.customer_id;
    this.finalized = data.finalized;
    this.paid = data.paid;
    this.date = data.date;
    this.deadline = data.deadline;
    this.total = data.total;
    this.tax = data.tax;
    this.invoice_lines = data.invoice_lines;
    this.customer = data.customer;
  }

  // Business methods
  isOverdue(): boolean {
    if (!this.deadline || this.paid) return false;
    return new Date(this.deadline) < new Date();
  }

  getOutstandingAmount(): number {
    if (this.paid || !this.total) return 0;
    return parseFloat(this.total);
  }
}