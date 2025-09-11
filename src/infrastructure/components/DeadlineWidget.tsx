import { DeadlineData } from '../../domain/useCases';

interface DeadlineWidgetProps {
  data: DeadlineData;
}

export const DeadlineWidget: React.FC<DeadlineWidgetProps> = ({ data }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Respect des Échéances</h5>
        <div className="row">
          <div className="col-md-6">
            <h6>Factures à échéance (7-30 jours)</h6>
            <ul className="list-group">
              {data.dueSoon.slice(0, 5).map((inv) => (
                <li key={inv.id} className="list-group-item">
                  #{inv.id} - {inv.total}€ - Échéance: {inv.deadline}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-6">
            <h6>Factures en retard</h6>
            <ul className="list-group">
              {data.overdue.slice(0, 5).map((inv) => (
                <li key={inv.id} className="list-group-item list-group-item-danger">
                  #{inv.id} - {inv.total}€ - Retard depuis: {inv.deadline}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};