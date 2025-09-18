import { render, screen } from '@testing-library/react'
import { BaseChartWidget } from '../BaseChartWidget'

describe('BaseChartWidget', () => {
  const defaultProps = {
    title: 'Test Chart',
    children: <div data-testid="chart-content">Chart Content</div>,
  }

  it('displays title and content', () => {
    render(<BaseChartWidget {...defaultProps} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Test Chart' })).toBeInTheDocument()
    expect(screen.getByTestId('chart-content')).toBeInTheDocument()
  })

  it('displays loading state', () => {
    render(<BaseChartWidget {...defaultProps} isLoading={true} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Test Chart' })).toBeInTheDocument()
    expect(screen.getByText('Chargement des données...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('displays error state', () => {
    const errorMessage = 'Connection error'
    render(<BaseChartWidget {...defaultProps} error={errorMessage} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Test Chart' })).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(`Erreur: ${errorMessage}`)
  })

  it('hides content when error occurs', () => {
    render(<BaseChartWidget {...defaultProps} error="Test error" />)

    expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('hides content during loading', () => {
    render(<BaseChartWidget {...defaultProps} isLoading={true} />)

    expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument()
    expect(screen.getByText('Chargement des données...')).toBeInTheDocument()
  })
})