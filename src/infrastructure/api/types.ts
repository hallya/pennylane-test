import { Components } from '../../api/gen/client'

export type InvoiceLine = Components.Schemas.InvoiceLine;

export type Customer = Components.Schemas.Customer;

export type Invoice = Components.Schemas.Invoice & {
  customer?: Customer;
};

export type Product = Components.Schemas.Product;