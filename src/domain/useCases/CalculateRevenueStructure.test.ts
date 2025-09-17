import { describe, it, expect, beforeEach } from 'vitest';
import { CalculateRevenueStructure } from './CalculateRevenueStructure';
import { InvoiceTestDataFactory, CustomerTestDataFactory, ProductTestDataFactory, InvoiceLineTestDataFactory } from '../__tests__/utils';

const CUSTOMER_1 = CustomerTestDataFactory.create({ first_name: 'John', last_name: 'Doe' });
const PRODUCT_1 = ProductTestDataFactory.create({ label: 'Service A', vat_rate: '20' });
const PRODUCT_2 = ProductTestDataFactory.create({ label: 'Product B', vat_rate: '10' });

describe('CalculateRevenueStructure', () => {
  let useCase: CalculateRevenueStructure;

  beforeEach(() => {
    useCase = new CalculateRevenueStructure();
  });

  it('should return empty objects for no invoices', () => {
    const result = useCase.execute([]);
    expect(result.byClient).toEqual([]);
    expect(result.byProduct).toEqual([]);
    expect(result.byVatRate).toEqual([]);
  });

  it('should ignore non-finalized invoices', () => {
    const invoices = [
      InvoiceTestDataFactory.create({ finalized: false, total: '1000.00' }),
    ];
    const result = useCase.execute(invoices);
    expect(result.byClient).toEqual([]);
    expect(result.byProduct).toEqual([]);
    expect(result.byVatRate).toEqual([]);
  });

  it('should calculate revenue by client', () => {
    const invoices = [
      InvoiceTestDataFactory.create({
        id: 1,
        finalized: true,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '1000.00',
        invoice_lines: []
      }),
      InvoiceTestDataFactory.create({
        id: 2,
        finalized: true,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '2000.00',
        invoice_lines: []
      }),
    ];
    const result = useCase.execute(invoices);
    expect(result.byClient).toHaveLength(1);
    expect(result.byClient[0]).toEqual({
      clientId: CUSTOMER_1.id,
      name: 'John Doe',
      revenue: 3000,
    });
  });

  it('should calculate revenue by product', () => {
    const invoices = [
      InvoiceTestDataFactory.create({
        id: 1,
        finalized: true,
        customer_id: 1,
        customer: CUSTOMER_1,
        total: '1000.00',
        invoice_lines: [
          InvoiceLineTestDataFactory.create({
            invoice_id: 1,
            product_id: PRODUCT_1.id,
            quantity: 2,
            price: '200.00',
            product: PRODUCT_1
          })
        ]
      }),
    ];
    const result = useCase.execute(invoices);
    expect(result.byProduct).toHaveLength(1);
    expect(result.byProduct[0]).toEqual({
      productId: PRODUCT_1.id,
      label: 'Service A',
      revenue: 400,
    });
  });

  it('should calculate revenue by VAT rate', () => {
    const invoices = [
      InvoiceTestDataFactory.create({
        id: 1,
        finalized: true,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '1000.00',
        invoice_lines: [
          {
            id: 1,
            invoice_id: 1,
            product_id: PRODUCT_1.id,
            quantity: 1,
            label: 'Service A',
            unit: 'hour',
            vat_rate: '20',
            price: '100.00',
            tax: '20.00',
            product: PRODUCT_1
          }
        ]
      }),
    ];
    const result = useCase.execute(invoices);
    expect(result.byVatRate).toHaveLength(1);
    expect(result.byVatRate[0]).toEqual({
      vatRate: '20',
      revenue: 20,
    });
  });

  it('should handle mixed scenarios', () => {
    const customer2 = CustomerTestDataFactory.create({ first_name: 'Jane', last_name: 'Smith' });

    const invoices = [
    
      InvoiceTestDataFactory.create({
        id: 1,
        finalized: true,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '1000.00',
        invoice_lines: [
          InvoiceLineTestDataFactory.create({
            invoice_id: 1,
            product_id: PRODUCT_1.id,
            quantity: 2,
            price: '300.00',
            vat_rate: '20',
            tax: '60.00',
            product: PRODUCT_1
          }),
          InvoiceLineTestDataFactory.create({
            invoice_id: 1,
            product_id: PRODUCT_2.id,
            quantity: 1,
            price: '50.00',
            vat_rate: '10',
            tax: '5.00',
            product: PRODUCT_2
          })
        ]
      }),
    
      InvoiceTestDataFactory.create({
        id: 2,
        finalized: true,
        customer_id: CUSTOMER_1.id,
        customer: CUSTOMER_1,
        total: '500.00',
        invoice_lines: [
          InvoiceLineTestDataFactory.create({
            invoice_id: 2,
            product_id: PRODUCT_1.id,
            quantity: 1,
            price: '100.00',
            vat_rate: '20',
            tax: '20.00',
            product: PRODUCT_1
          })
        ]
      }),
    
      InvoiceTestDataFactory.create({
        id: 3,
        finalized: true,
        customer_id: customer2.id,
        customer: customer2,
        total: '200.00',
        invoice_lines: [
          InvoiceLineTestDataFactory.create({
            invoice_id: 3,
            product_id: PRODUCT_2.id,
            quantity: 1,
            price: '50.00',
            vat_rate: '10',
            tax: '5.00',
            product: PRODUCT_2
          })
        ]
      }),
    
      InvoiceTestDataFactory.create({
        id: 4,
        finalized: false,
        customer_id: 1,
        customer: CUSTOMER_1,
        total: '1000.00',
        invoice_lines: []
      }),
    ];

    const result = useCase.execute(invoices);

  
    expect(result.byClient).toHaveLength(2);
    expect(result.byClient).toEqual(
      expect.arrayContaining([
        { clientId: CUSTOMER_1.id, name: 'John Doe', revenue: 750 },
        { clientId: customer2.id, name: 'Jane Smith', revenue: 50 },
      ])
    );

  
    expect(result.byProduct).toHaveLength(2);
    expect(result.byProduct).toEqual(
      expect.arrayContaining([
        { productId: PRODUCT_1.id, label: 'Service A', revenue: 700 },
        { productId: PRODUCT_2.id, label: 'Product B', revenue: 100 },
      ])
    );

  
    expect(result.byVatRate).toHaveLength(2);
    expect(result.byVatRate).toEqual(
      expect.arrayContaining([
        { vatRate: '20', revenue: 80 },
        { vatRate: '10', revenue: 10 },
      ])
    );
  });

  it('should handle invoices without customer', () => {
    const invoices = [
      InvoiceTestDataFactory.create({
        id: 1,
        finalized: true,
        customer_id: undefined,
        customer: undefined,
        total: '1000.00',
        invoice_lines: []
      }),
    ];
    const result = useCase.execute(invoices);
    expect(result.byClient).toEqual([]);
    expect(result.byProduct).toEqual([]);
    expect(result.byVatRate).toEqual([]);
  });

});
