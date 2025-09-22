import { useState } from 'react'
import { useApi } from '../../../api'
import { Components } from '../../../api/gen/client'

export const useSearchProducts = () => {
  const api = useApi()
  const [products, setProducts] = useState<Components.Schemas.Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchProducts = async (query: string) => {
    if (!query || query.length < 2) {
      setProducts([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const { data } = await api.getSearchProducts(null, null, {
        params: { query, per_page: 10 }
      })
      setProducts(data.products)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, searchProducts }
}