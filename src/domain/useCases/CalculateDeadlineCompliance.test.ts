import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CalculateDeadlineCompliance } from './CalculateDeadlineCompliance';
import { InvoiceTestDataFactory } from '../__tests__/utils/invoiceTestDataFactory';

// Test constants to avoid magic strings
const FIXED_CURRENT_DATE = '2023-10-01T00:00:00Z';
const OVERDUE_DATE = '2023-09-20';
const DUE_SOON_DATE = '2023-10-15';
const FUTURE_DATE = '2023-11-15';
const PAID_DATE = '2023-09-15';

describe('CalculateDeadlineCompliance', () => {
  let useCase: CalculateDeadlineCompliance;

  beforeEach(() => {
    useCase = new CalculateDeadlineCompliance();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(FIXED_CURRENT_DATE));
  });

  it('should return empty arrays for no invoices', () => {
    const result = useCase.execute([]);
    expect(result.dueSoon).toEqual([]);
    expect(result.overdue).toEqual([]);
  });

  it('should ignore paid invoices', () => {
    const invoices = [InvoiceTestDataFactory.paid({ deadline: PAID_DATE })];
    const result = useCase.execute(invoices);
    expect(result.dueSoon).toEqual([]);
    expect(result.overdue).toEqual([]);
  });

  it('should ignore invoices without deadline', () => {
    const invoices = [InvoiceTestDataFactory.withoutDeadline()];
    const result = useCase.execute(invoices);
    expect(result.dueSoon).toEqual([]);
    expect(result.overdue).toEqual([]);
  });

  it('should identify overdue invoices', () => {
    const invoices = [InvoiceTestDataFactory.overdue({ id: 1, deadline: OVERDUE_DATE })];
    const result = useCase.execute(invoices);
    expect(result.dueSoon).toEqual([]);
    expect(result.overdue).toHaveLength(1);
    expect(result.overdue[0].id).toBe(1);
  });

  it('should identify due soon invoices', () => {
    const invoices = [InvoiceTestDataFactory.dueSoon({ id: 1, deadline: DUE_SOON_DATE })];
    const result = useCase.execute(invoices);
    expect(result.dueSoon).toHaveLength(1);
    expect(result.dueSoon[0].id).toBe(1);
    expect(result.overdue).toEqual([]);
  });

  it('should not identify invoices due after 30 days as due soon', () => {
    const invoices = [InvoiceTestDataFactory.future({ id: 1, deadline: FUTURE_DATE })];
    const result = useCase.execute(invoices);
    expect(result.dueSoon).toEqual([]);
    expect(result.overdue).toEqual([]);
  });

  it('should handle mixed scenarios', () => {
    const invoices = [
      InvoiceTestDataFactory.paid({ id: 1, deadline: OVERDUE_DATE }),
      InvoiceTestDataFactory.withoutDeadline({ id: 2 }),
      InvoiceTestDataFactory.overdue({ id: 3, deadline: OVERDUE_DATE }),
      InvoiceTestDataFactory.dueSoon({ id: 4, deadline: DUE_SOON_DATE }),
      InvoiceTestDataFactory.future({ id: 5, deadline: FUTURE_DATE }),
    ];
    const result = useCase.execute(invoices);
    expect(result.dueSoon).toHaveLength(1);
    expect(result.dueSoon[0].id).toBe(4);
    expect(result.overdue).toHaveLength(1);
    expect(result.overdue[0].id).toBe(3);
  });
});