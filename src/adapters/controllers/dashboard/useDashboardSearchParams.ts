import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardSearchParams } from './types';

const DEFAULT_DEADLINE_COMPLIANCE_DAYS = 7;
const DEFAULT_YEAR = 2025;

export const useDashboardSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const deadlineComplianceDays = useMemo(() => {
    const value = searchParams.get('deadlineComplianceDays');
    const parsed = value ? parseInt(value, 10) : NaN;
    return isNaN(parsed) ? DEFAULT_DEADLINE_COMPLIANCE_DAYS : parsed;
  }, [searchParams]);

  const year = useMemo(() => {
    const value = searchParams.get('year');
    const parsed = value ? parseInt(value, 10) : NaN;
    return isNaN(parsed) ? DEFAULT_YEAR : parsed;
  }, [searchParams]);

  const setDeadlineComplianceDays = useCallback((days: number) => {
    setSearchParams((prev) => {
      prev.set('deadlineComplianceDays', days.toString());
      return prev;
    });
  }, []);

  const setYear = useCallback((yearValue: number) => {
    setSearchParams((prev) => {
      prev.set('year', yearValue.toString());
      return prev;
    });
  }, []);

  const getParams = useMemo((): DashboardSearchParams => ({
    deadlineComplianceDays,
    year,
  }), [deadlineComplianceDays, year]);

  const setParams = useCallback((params: Partial<DashboardSearchParams>) => {
    setSearchParams((prev) => {
      if (params.deadlineComplianceDays !== undefined) {
        prev.set('deadlineComplianceDays', params.deadlineComplianceDays.toString());
      }
      if (params.year !== undefined) {
        prev.set('year', params.year.toString());
      }
      return prev;
    });
  }, []);

  return {
    deadlineComplianceDays,
    setDeadlineComplianceDays,
    year,
    setYear,
    getParams,
    setParams,
  };
};