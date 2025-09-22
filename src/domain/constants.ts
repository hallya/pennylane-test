export const DSO_DAYS_PERIOD = 30;
export const AT_RISK_DSO_DAYS_THRESHOLD = 30;
export const AT_RISK_DSO_MILLISECONDS_THRESHOLD = 30 * 24 * 60 * 60 * 1000;
export const LARGE_OUTSTANDING_EUROS_THRESHOLD = 5000;
export const AT_RISK_OUTSTANDING_EUROS_THRESHOLD = 10000;

export const INVOICE_FORM_CONSTANTS = {
  SEARCH_DEBOUNCE_MS: 300,
  MIN_SEARCH_LENGTH: 3,
  MIN_PRODUCT_SEARCH_LENGTH: 2,
  DEFAULT_QUANTITY: 1,
} as const;

export const INVOICE_STATUS = {
  DRAFT: 'draft',
  FINALIZED_UNPAID: 'finalized_unpaid',
  PAID: 'paid',
  OVERDUE: 'overdue',
  DUE_SOON: 'due_soon'
} as const;

export const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUS.DRAFT]: 'À finaliser',
  [INVOICE_STATUS.FINALIZED_UNPAID]: 'En attente de paiement',
  [INVOICE_STATUS.PAID]: 'Payée',
  [INVOICE_STATUS.OVERDUE]: 'En retard de paiement',
  [INVOICE_STATUS.DUE_SOON]: 'Échéance proche'
} as const;

export const INVOICE_STATUS_COLORS = {
  [INVOICE_STATUS.DRAFT]: '#6c757d',
  [INVOICE_STATUS.FINALIZED_UNPAID]: '#ffc107',
  [INVOICE_STATUS.PAID]: '#28a745',
  [INVOICE_STATUS.OVERDUE]: '#dc3545',
  [INVOICE_STATUS.DUE_SOON]: '#fd7e14'
} as const;

export const OVERDUE_COLOR = '#dc3545';

export const INVOICE_STATUS_BOOTSTRAP_CLASSES = {
  [INVOICE_STATUS.DRAFT]: 'text-secondary',
  [INVOICE_STATUS.FINALIZED_UNPAID]: 'text-warning',
  [INVOICE_STATUS.PAID]: 'text-success',
  [INVOICE_STATUS.OVERDUE]: 'text-danger',
  [INVOICE_STATUS.DUE_SOON]: 'text-warning'
} as const;

export const OVERDUE_BOOTSTRAP_CLASS = 'text-danger';
export const DUE_SOON_BOOTSTRAP_CLASS = 'text-warning';
