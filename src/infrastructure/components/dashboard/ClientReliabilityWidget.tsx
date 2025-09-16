import { ClientReliabilityData } from '../../../domain/useCases';

interface ClientReliabilityWidgetProps {
  data: ClientReliabilityData;
}

export const ClientReliabilityWidget: React.FC<ClientReliabilityWidgetProps> = ({ data }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Fiabilité du Portefeuille Clients</h5>
        <div className="row">
          <div className="col-md-6">
            <h6>Clients payant en retard</h6>
            <ul className="list-group">
              {data.latePayers.slice(0, 5).map((client) => (
                <li key={client.customerId} className="list-group-item">
                  {client.name} - {client.lateCount} retards
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-6">
            <h6>Clients avec gros encours</h6>
            <ul className="list-group">
              {data.largeOutstanding.slice(0, 5).map((client) => (
                <li key={client.customerId} className="list-group-item">
                  {client.name} - {client.amount}€
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};