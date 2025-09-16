import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../../../api';
import { InvoiceGatewayImpl } from '../../gateways';
import { CalculateDeadlineCompliance, DeadlineData } from '../../../domain/useCases';
import { useDashboardSearchParams } from './useDashboardSearchParams';

export const useDeadlineCompliance = () => {
  const api = useApi();
  const [data, setData] = useState<DeadlineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { deadlineComplianceDays } = useDashboardSearchParams();

  const fetchDeadlineCompliance = useCallback(async () => {
    try {
      setLoading(true);
      const gateway = new InvoiceGatewayImpl(api);
      const invoices = await gateway.getAllInvoices();
      const useCase = new CalculateDeadlineCompliance();
      const result = useCase.execute(invoices, deadlineComplianceDays);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [api, deadlineComplianceDays]);

  useEffect(() => {
    fetchDeadlineCompliance();
  }, [fetchDeadlineCompliance]);

  return { data, loading, error, refetch: fetchDeadlineCompliance };
};