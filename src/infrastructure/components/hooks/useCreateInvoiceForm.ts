import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateInvoice } from '../../../adapters/controllers'
import { useSearchCustomers } from '../../../adapters/controllers/customers'
import { useSearchProducts } from '../../../adapters/controllers/products/useProducts'
import { useDebouncedSearch, useFormManager } from './index'
import { Components } from '../../../api/gen/client'
import { ValidationMode, InvoiceFormData } from '../../pages/invoices/types'
import { INVOICE_FORM_CONSTANTS } from '../../../domain/constants'

export function useCreateInvoiceForm() {
  const navigate = useNavigate()
  const { createInvoice } = useCreateInvoice()

  const [selectedCustomer, setSelectedCustomer] =
    useState<Components.Schemas.Customer | null>(null)
  const [selectedProduct, setSelectedProduct] =
    useState<Components.Schemas.Product | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showProducts, setShowProducts] = useState(false)

  const { form, handleSubmit } = useFormManager<InvoiceFormData>({
    onSubmit: async (data) => {
      if (!selectedCustomer) return

      const payload = {
        customer_id: selectedCustomer.id,
        finalized: validationMode === 'finalize',
        ...(data.paid !== undefined && { paid: data.paid }),
        ...(data.date && { date: data.date }),
        ...(data.deadline && { deadline: data.deadline }),
        invoice_lines_attributes: Array.from(data.invoiceLines.values()),
      }

      await createInvoice(payload)
      navigate('/invoices')
    },
    initialValues: {
      customerName: '',
      date: '',
      deadline: '',
      paid: false,
      invoiceLines: new Map(),
      quantity: INVOICE_FORM_CONSTANTS.DEFAULT_QUANTITY,
    },
    mode: 'onSubmit',
  })

  const [validationMode, setValidationMode] = useState<ValidationMode | null>(
    null
  )

  const { customers, searchCustomers } = useSearchCustomers()

  const { query: customerSearchQuery, updateQuery: updateCustomerQuery } =
    useDebouncedSearch(
      searchCustomers,
      INVOICE_FORM_CONSTANTS.MIN_SEARCH_LENGTH,
      INVOICE_FORM_CONSTANTS.SEARCH_DEBOUNCE_MS
    )

  useEffect(() => {
    setShowSuggestions(!!customerSearchQuery)
  }, [customerSearchQuery])

  const handleCustomerSearchChange = (value: string) => {
    updateCustomerQuery(value)
    if (
      selectedCustomer &&
      value !== `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
    ) {
      setSelectedCustomer(null)
    }
  }

  const handleCustomerSelect = (customer: Components.Schemas.Customer) => {
    setSelectedCustomer(customer)
    form.setValue(
      'customerName',
      `${customer.first_name} ${customer.last_name}`
    )
    form.clearErrors('customerName')
    setShowSuggestions(false)
  }

  const { products, searchProducts: originalSearchProducts } =
    useSearchProducts()
  const { query: productSearchQuery, updateQuery: updateProductQuery } =
    useDebouncedSearch(
      originalSearchProducts,
      INVOICE_FORM_CONSTANTS.MIN_PRODUCT_SEARCH_LENGTH,
      INVOICE_FORM_CONSTANTS.SEARCH_DEBOUNCE_MS
    )
  const searchProducts = (query: string) => {
    updateProductQuery(query)
    setShowProducts(true)
  }

  const handleAddProductToInvoice = (
    product: Components.Schemas.Product,
    quantity: number
  ) => {
    const currentLines = form.watch('invoiceLines')
    const existingLine = currentLines.get(product.id)

    if (existingLine) {
      const currentQuantity = existingLine.quantity || 0
      const updatedLine = {
        ...existingLine,
        quantity: currentQuantity + quantity,
      }
      currentLines.set(product.id, updatedLine)
    } else {
      const newLine = {
        product_id: product.id,
        quantity,
        label: product.label,
        unit: product.unit,
        vat_rate: product.vat_rate,
        price: product.unit_price,
        tax: product.unit_tax,
      }
      currentLines.set(product.id, newLine)
    }

    form.setValue('invoiceLines', new Map(currentLines))
    setSelectedProduct(null)
  }

  const handleRemoveLine = (productId: number) => {
    const currentLines = form.watch('invoiceLines')
    currentLines.delete(productId)
    form.setValue('invoiceLines', new Map(currentLines))
  }

  const handleSave = () => {
    setValidationMode('save')
    handleSubmit()
  }

  const handleFinalize = () => {
    setValidationMode('finalize')
    handleSubmit()
  }

  return {
    form,
    validationMode,
    customers,
    selectedCustomer,
    setSelectedCustomer,
    showSuggestions,
    setShowSuggestions,
    handleCustomerSearchChange,
    handleCustomerSelect,
    products,
    productSearchQuery,
    updateProductQuery,
    searchProducts,
    selectedProduct,
    setSelectedProduct,
    showProducts,
    setShowProducts,
    invoiceLines: form.watch('invoiceLines') || [],
    handleAddProductToInvoice,
    handleRemoveLine,
    handleSave,
    handleFinalize,
  }
}
