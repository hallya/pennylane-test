import { useState, useEffect } from 'react';
import { useApi } from '../../api';
import { InvoiceGatewayImpl } from '../gateways';
import {
  GetDashboardData,
  CalculateCashFlow,
  CalculateDeadlineCompliance,
  CalculateClientReliability,
  CalculateRevenueStructure,
  DashboardData,
} from '../../domain/useCases';

export const useDashboard = () => {
  const api = useApi();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const gateway = new InvoiceGatewayImpl(api);
        const useCase = new GetDashboardData(
          gateway,
          new CalculateCashFlow(),
          new CalculateDeadlineCompliance(),
          new CalculateClientReliability(),
          new CalculateRevenueStructure()
        );
        const result = await useCase.execute();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [api]);

  return { data, loading, error };
};