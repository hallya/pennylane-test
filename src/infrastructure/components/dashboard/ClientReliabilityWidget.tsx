import React from 'react';
import { ClientReliabilityData } from '../../../domain/useCases';

interface ClientReliabilityWidgetProps {
  data: ClientReliabilityData;
}

export const ClientReliabilityWidget: React.FC<ClientReliabilityWidgetProps> = React.memo(({ data }) => {
  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">Fiabilité du Portefeuille Clients</h5>
        <div className="row flex-grow-1">
          <div className="col-md-6 d-flex flex-column">
            <h6>Clients payant en retard</h6>
            <div className="flex-grow-1 d-flex flex-column">
              <ul className="list-group flex-grow-1">
                {data.latePayers.slice(0, 5).map((client) => (
                  <li key={client.customerId} className="list-group-item small">
                    {client.name} - {client.lateCount} retards
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-6 d-flex flex-column">
            <h6>Clients avec gros encours</h6>
            <div className="flex-grow-1 d-flex flex-column">
              <ul className="list-group flex-grow-1">
                {data.largeOutstanding.slice(0, 5).map((client) => (
                  <li key={client.customerId} className="list-group-item small">
                    {client.name} - {client.amount}€
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});