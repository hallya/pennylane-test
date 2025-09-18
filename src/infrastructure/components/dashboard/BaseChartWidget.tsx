import React from 'react'

interface BaseChartWidgetProps {
  title: string
  children: React.ReactNode
  isLoading?: boolean
  error?: string | null
  className?: string
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
  const widgetId = React.useId()
  const titleId = `${widgetId}-title`
  const contentId = `${widgetId}-content`
  const statusId = `${widgetId}-status`

  if (isLoading) {
    return (
      <section
        className={`card h-100 ${className}`}
        aria-labelledby={titleId}
        aria-describedby={statusId}
        aria-busy="true"
      >
        <div className="card-body d-flex flex-column">
          <h2 id={titleId} className="card-title">{title}</h2>
          <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <div
                className="spinner-border text-primary"
                role="status"
                aria-describedby={statusId}
              >
                <span className="visually-hidden">Chargement...</span>
              </div>
              <div id={statusId} className="mt-2" aria-live="polite">
                Chargement des données...
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        className={`card h-100 ${className}`}
        aria-labelledby={titleId}
        aria-describedby={contentId}
      >
        <div className="card-body d-flex flex-column">
          <h2 id={titleId} className="card-title">{title}</h2>
          <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div
              id={contentId}
              className="alert alert-danger text-center"
              role="alert"
              aria-live="assertive"
            >
              <i className="bi bi-exclamation-triangle me-2" aria-hidden="true"></i>
              Erreur: {error}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className={`card ${className}`}
      aria-labelledby={titleId}
      aria-describedby={contentId}
      data-testid="base-chart-widget"
    >
      <div className="card-body d-flex flex-column gap-2">
        <h2 id={titleId} className="card-title mb-0">{title}</h2>
        <div id={contentId} className="d-flex flex-column gap-2" role="region" aria-label={`Contenu du graphique ${title}`}>
          {children}
        </div>
      </div>
    </section>
  )
}
