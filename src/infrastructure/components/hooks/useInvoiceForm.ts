import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useCreateInvoice,
  useUpdateInvoice,
  useGetInvoice,
  useSearchCustomers,
  useSearchProducts,
} from '../../../adapters/controllers'
import { useDebouncedSearch, useFormManager } from './index'
import { ValidationMode, InvoiceFormData } from '../../pages/invoices/types'
import { INVOICE_FORM_CONSTANTS } from '../../../domain/constants'
import {
  DomainCustomer,
  DomainInvoiceUpdatePayload,
  DomainProduct,
} from '../../../domain/types'

type InvoiceFormMode = 'create' | 'edit'

export function useInvoiceForm(
  mode: InvoiceFormMode,
  invoiceId: number | null = null
) {
  const navigate = useNavigate()
  const { createInvoice } = useCreateInvoice()
  const { updateInvoice } = useUpdateInvoice()
  const { data: invoiceData, loading: invoiceLoading } = useGetInvoice(
    mode === 'edit' ? invoiceId : null
  )

  const [selectedCustomer, setSelectedCustomer] =
    useState<DomainCustomer | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<DomainProduct | null>(
    null
  )
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showProducts, setShowProducts] = useState(false)

  const { form } = useFormManager<InvoiceFormData>({
    onSubmit: () => {},
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

  useEffect(() => {
    if (mode === 'edit' && invoiceData && !invoiceLoading) {
      if (invoiceData.customer) {
        setSelectedCustomer(invoiceData.customer)
        form.setValue(
          'customerName',
          `${invoiceData.customer.first_name} ${invoiceData.customer.last_name}`
        )
      }

      form.setValue('date', invoiceData.date || '')
      form.setValue('deadline', invoiceData.deadline || '')
      form.setValue('paid', invoiceData.paid)

      const linesMap = new Map(
        invoiceData.invoice_lines.map((line) => [
          line.product_id,
          {
            ...line,
            id: line.id,
            product_id: line.product_id,
            quantity: line.quantity,
            label: line.label,
            unit: line.unit,
            vat_rate: line.vat_rate,
            price: line.price,
            tax: line.tax,
          },
        ])
      )
      form.setValue('invoiceLines', linesMap)
    }
  }, [mode, invoiceData, invoiceLoading, form])

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

  const handleCustomerSelect = (customer: DomainCustomer) => {
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
    product: DomainProduct,
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

  const submitInvoice = async (data: InvoiceFormData, finalized: boolean) => {
    if (!selectedCustomer) return

    const basePayload = {
      customer_id: selectedCustomer.id,
      finalized,
      ...(data.paid !== undefined && { paid: data.paid }),
      ...(data.date && { date: data.date }),
      ...(data.deadline && { deadline: data.deadline }),
      invoice_lines_attributes: Array.from(data.invoiceLines.values()),
    }

    if (mode === 'create') {
      await createInvoice(basePayload)
    } else if (mode === 'edit' && invoiceId) {
      const payload: DomainInvoiceUpdatePayload = {
        id: invoiceId,
        ...basePayload,
      }
      await updateInvoice(invoiceId, payload)
    }
    navigate('/invoices')
  }

  const handleSave = () => {
    setValidationMode('save')
    form.handleSubmit((data) => submitInvoice(data, false))()
  }

  const handleFinalize = () => {
    setValidationMode('finalize')
    form.handleSubmit((data) => submitInvoice(data, true))()
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
