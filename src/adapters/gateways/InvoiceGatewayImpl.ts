import { InvoiceGateway } from '../../domain/useCases'
import {
  DomainInvoice,
  DomainPaginatedInvoices,
  DomainInvoiceCreatePayload,
  DomainInvoiceUpdatePayload,
} from '../../domain/types'

import {
  FilterItem,
  InvoiceFilters,
} from '../../domain/useCases/InvoiceGateway'
import { Client } from '../../domain/types/api'

type FilterMapping = {
  key: keyof InvoiceFilters
  field: string
  operator: string
  customHandler?: (value: unknown) => FilterItem[]
}

export class InvoiceGatewayImpl implements InvoiceGateway {
  constructor(private api: Client) {}

  private readonly filterMappings: FilterMapping[] = [
    { key: 'id', field: 'id', operator: 'eq' },
    { key: 'customerId', field: 'customer_id', operator: 'eq' },
    { key: 'finalized', field: 'finalized', operator: 'eq' },
    { key: 'paid', field: 'paid', operator: 'eq' },
    { key: 'date', field: 'date', operator: 'eq' },
    { key: 'dateFrom', field: 'date', operator: 'gteq' },
    { key: 'dateTo', field: 'date', operator: 'lteq' },
    { key: 'deadline', field: 'deadline', operator: 'eq' },
    { key: 'deadlineFrom', field: 'deadline', operator: 'gteq' },
    { key: 'deadlineTo', field: 'deadline', operator: 'lteq' },
    {
      key: 'year',
      field: '',
      operator: '',
      customHandler: (year: unknown) => [
        { field: 'date', operator: 'gteq', value: `${year as number}-01-01` },
        { field: 'date', operator: 'lteq', value: `${year as number}-12-31` },
      ],
    },
  ]

  private convertFiltersToFilterItems(filters: InvoiceFilters): FilterItem[] {
    const items: FilterItem[] = []

    for (const mapping of this.filterMappings) {
      const value = filters[mapping.key]
      if (value !== undefined) {
        if (mapping.customHandler) {
          items.push(...mapping.customHandler(value))
        } else {
          items.push({
            field: mapping.field,
            operator: mapping.operator,
            value,
          })
        }
      }
    }

    return items
  }

  async getAllInvoices(
    page?: number,
    perPage?: number,
    filters?: InvoiceFilters
  ): Promise<DomainPaginatedInvoices> {
    const params: Record<string, unknown> = {}
    if (page !== undefined) params.page = page
    if (perPage !== undefined) params.per_page = perPage

    if (filters) {
      const filterItems = this.convertFiltersToFilterItems(filters)
      if (filterItems.length > 0) {
        params.filter = JSON.stringify(filterItems)
      }
    }

    const { data } = await this.api.getInvoices(params)
    return data
  }

  async getInvoice(id: number): Promise<DomainInvoice> {
    const { data } = await this.api.getInvoice(id)
    return data
  }

  async createInvoice(
    payload: DomainInvoiceCreatePayload
  ): Promise<DomainInvoice> {
    const { data } = await this.api.postInvoices(null, { invoice: payload })
    return data
  }

  async updateInvoice(
    id: number,
    payload: DomainInvoiceUpdatePayload
  ): Promise<DomainInvoice> {
    const { data } = await this.api.putInvoice(id, { invoice: payload })
    return data
  }

  async deleteInvoice(id: number): Promise<void> {
    await this.api.deleteInvoice(id)
  }
}
