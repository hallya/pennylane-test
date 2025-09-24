import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ProductLinesSelector } from '../ProductLinesSelector'
import { ProductTestDataFactory } from '../../../../domain/__tests__/utils/productTestDataFactory'
import { FormWrapper } from '../../../shared/FormWrapper'
import { InvoiceFormData } from '../../../pages/invoices/types'




describe('ProductLinesSelector', () => {
  const mockProducts = [
    ProductTestDataFactory.create({
      id: 1,
      label: 'Product A',
      unit_price: '10.00',
      vat_rate: '20',
    }),
    ProductTestDataFactory.create({
      id: 2,
      label: 'Product B',
      unit_price: '15.00',
      vat_rate: '10',
    }),
  ]

  const mockInvoiceLines = new Map([
    [
      1,
      {
        product_id: 1,
        quantity: 2,
        label: 'Product A',
        unit: 'piece' as const,
        vat_rate: '20' as const,
        price: '20.00',
        tax: '4.00',
      },
    ],
  ])

  const defaultProps = {
    products: mockProducts,
    productSearchQuery: '',
    updateProductQuery: () => {},
    searchProducts: () => {},
    selectedProduct: null,
    setSelectedProduct: () => {},
    showProducts: false,
    setShowProducts: () => {},
    invoiceLines: mockInvoiceLines,
    handleAddProductToInvoice: () => {},
    handleRemoveLine: () => {},
    validationMode: null,
  }

  it('renders the component structure', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <ProductLinesSelector form={form} {...defaultProps} />}
      </FormWrapper>
    )

    expect(screen.getByText('Lignes de Produits')).toBeInTheDocument()
  })

  it('renders product search input', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <ProductLinesSelector form={form} {...defaultProps} />}
      </FormWrapper>
    )

    const input = screen.getByPlaceholderText('Rechercher un produit...')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('renders quantity input', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <ProductLinesSelector form={form} {...defaultProps} />}
      </FormWrapper>
    )

    const quantityInput = screen.getByPlaceholderText('Quantité')
    expect(quantityInput).toBeInTheDocument()
    expect(quantityInput).toHaveAttribute('type', 'number')
    expect(quantityInput).toHaveAttribute('min', '1')
  })

  it('renders add button', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <ProductLinesSelector form={form} {...defaultProps} />}
      </FormWrapper>
    )

    const addButton = screen.getByRole('button', { name: 'Ajouter' })
    expect(addButton).toBeInTheDocument()
    expect(addButton).toBeDisabled()
  })

  it('shows products dropdown when showProducts is true', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <ProductLinesSelector form={form} {...defaultProps} showProducts={true} />}
      </FormWrapper>
    )

    expect(screen.getAllByText('Product A')).toHaveLength(2)
  })

  it('renders product suggestions', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <ProductLinesSelector form={form} {...defaultProps} showProducts={true} />}
      </FormWrapper>
    )

    expect(screen.getAllByText('Product A')).toHaveLength(2)
    expect(screen.getByText('Product B')).toBeInTheDocument()
  })

  it('renders invoice lines when present', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <ProductLinesSelector form={form} {...defaultProps} />}
      </FormWrapper>
    )

    expect(screen.getByText('Product A')).toBeInTheDocument()
    expect(
      screen.getByText((content) => content.includes('Quantité: 2'))
    ).toBeInTheDocument()
    expect(
      screen.getByText((content) => content.includes('Prix TTC:'))
    ).toBeInTheDocument()
  })

  it('renders remove button for each line', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <ProductLinesSelector form={form} {...defaultProps} />}
      </FormWrapper>
    )

    const removeButton = screen.getByRole('button', { name: 'Supprimer' })
    expect(removeButton).toBeInTheDocument()
  })

  it('displays totals correctly', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <ProductLinesSelector form={form} {...defaultProps} />}
      </FormWrapper>
    )

    expect(screen.getByText('Quantité totale:')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Taxe totale:')).toBeInTheDocument()
    expect(screen.getByText('4 €')).toBeInTheDocument()
    expect(screen.getByText('Total TTC:')).toBeInTheDocument()
    expect(screen.getByText('40 €')).toBeInTheDocument()
  })

  it('shows required attribute when validationMode is finalize', () => {
    render(
      <FormWrapper<InvoiceFormData>>
        {(form) => <ProductLinesSelector form={form} {...defaultProps} validationMode="finalize" />}
      </FormWrapper>
    )

    const input = screen.getByPlaceholderText('Rechercher un produit...')
    expect(input).toHaveAttribute('required')
  })
})

