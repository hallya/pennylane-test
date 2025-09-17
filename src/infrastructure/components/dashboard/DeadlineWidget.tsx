import { Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useDeadlineChartData } from '../hooks/useDeadlineChartData'
import { useDashboardSearchParams, useDeadlineCompliance } from '../../../adapters/controllers'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const COUNT_DAYS_RANGE = [7, 15, 30]

export const DeadlineWidget: React.FC = () => {
  const { deadlineComplianceDays, setDeadlineComplianceDays } = useDashboardSearchParams()
  const { data, loading, error } = useDeadlineCompliance()
  const selectedDays = deadlineComplianceDays
  const chartData = useDeadlineChartData(data || { dueSoon: [], overdue: [] }, selectedDays)

  if (loading) return <div className="text-center mt-3">Chargement des échéances...</div>;
  if (error) return <div className="alert alert-danger">Erreur: {error}</div>;
  if (!data) return <div className="text-center mt-3">Aucune donnée d'échéance</div>;

  const handleDaysChange = setDeadlineComplianceDays

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: `Échéances (${selectedDays} jours)` },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const days = context.parsed.x
            const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' })
            const relative = rtf.format(days, 'day')
            return `Montant: ${context.parsed.y}€, ${relative}`
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Jours depuis aujourd'hui" },
        suggestedMin: -selectedDays,
        suggestedMax: selectedDays,
        grid: {
          color: (context: any) =>
            context.tick.value === 0 ? '#979797ff' : '#e0e0e0',
        },
        ticks: {
          stepSize: 1,
          callback: (value: any) => `${value} j`,
        },
      },
      y: {
        title: { display: true, text: 'Montant (€)' },
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="card mh-100 overflow-auto">
      <div className="card-body">
        <h5 className="card-title">Respect des Échéances</h5>
        <div className="mb-3">
          <div className="btn-group" role="group">
            {COUNT_DAYS_RANGE.map((days) => (
              <button
                key={days}
                type="button"
                className={`btn ${
                  selectedDays === days ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => handleDaysChange(days)}
              >
                {days} jours
              </button>
            ))}
          </div>
        </div>
        <Scatter data={chartData} options={options} />
      </div>
    </div>
  )
}
