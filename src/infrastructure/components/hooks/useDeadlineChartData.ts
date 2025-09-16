import { useMemo } from 'react';
import { DeadlineData } from '../../../domain/useCases';

export const useDeadlineChartData = (data: DeadlineData, selectedDays: number) => {
  return useMemo(() => {
    const now = new Date();

    const dueSoonData = data.dueSoon
      .map(inv => {
        const deadline = new Date(inv.deadline || '');
        const daysDiff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          x: daysDiff,
          y: inv.getTotalAmount(),
        };
      })
      .filter(point => Math.abs(point.x) <= selectedDays);

    const overdueData = data.overdue
      .map(inv => {
        const deadline = new Date(inv.deadline || '');
        const daysDiff = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          x: daysDiff,
          y: inv.getTotalAmount(),
        };
      })
      .filter(point => Math.abs(point.x) <= selectedDays);

    return {
      datasets: [
        {
          label: 'Factures à échéance',
          data: dueSoonData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          pointRadius: 5,
        },
        {
          label: 'Factures en retard',
          data: overdueData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          pointRadius: 4,
        },
      ],
    };
  }, [data, selectedDays]);
};