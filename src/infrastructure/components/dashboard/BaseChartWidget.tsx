import React from 'react';

interface BaseChartWidgetProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * Base component for all dashboard chart widgets
 * Provides consistent structure, loading states, and error handling
 */
export const BaseChartWidget: React.FC<BaseChartWidgetProps> = ({
  title,
  children,
  isLoading = false,
  error = null,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`card h-100 ${className}`}>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <div className="mt-2">Chargement des données...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`card h-100 ${className}`}>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className="alert alert-danger text-center" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Erreur: {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card h-100 ${className}`}>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        {children}
      </div>
    </div>
  );
};