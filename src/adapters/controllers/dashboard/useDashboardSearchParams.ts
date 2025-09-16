import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardSearchParams } from './types';

const DEFAULT_DEADLINE_COMPLIANCE_DAYS = 7;

export const useDashboardSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const deadlineComplianceDays = useMemo(() => {
    const value = searchParams.get('deadlineComplianceDays');
    const parsed = value ? parseInt(value, 10) : NaN;
    return isNaN(parsed) ? DEFAULT_DEADLINE_COMPLIANCE_DAYS : parsed;
  }, [searchParams]);

  const setDeadlineComplianceDays = useCallback((days: number) => {
    setSearchParams((prev) => {
      prev.set('deadlineComplianceDays', days.toString());
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getParams = useMemo((): DashboardSearchParams => ({
    deadlineComplianceDays,
  }), [deadlineComplianceDays]);

  const setParams = useCallback((params: Partial<DashboardSearchParams>) => {
    setSearchParams((prev) => {
      if (params.deadlineComplianceDays !== undefined) {
        prev.set('deadlineComplianceDays', params.deadlineComplianceDays.toString());
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    deadlineComplianceDays,
    setDeadlineComplianceDays,
    getParams,
    setParams,
  };
};