import React from 'react'

interface FilterBadgeProps {
  customerName: string
  onRemove: () => void
}

const FilterBadge: React.FC<FilterBadgeProps> = ({ customerName, onRemove }) => {
  return (
    <div className="d-inline-flex align-items-center bg-primary text-white px-3 py-2 rounded-pill me-2 mb-2">
      <span className="me-2">
        <i className="bi bi-funnel-fill me-1"></i>
        Filtré par: {customerName}
      </span>
      <button
        type="button"
        className="btn-close btn-close-white filter-close-btn"
        aria-label="Supprimer le filtre"
        onClick={onRemove}
      ></button>
    </div>
  )
}

export default FilterBadge