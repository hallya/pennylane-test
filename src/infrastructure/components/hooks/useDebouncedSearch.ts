import { useState, useEffect, useRef } from 'react'
import { INVOICE_FORM_CONSTANTS } from '../../../domain/constants'

export function useDebouncedSearch(
  searchFunction: (query: string) => Promise<void> | void,
  minLength: number = INVOICE_FORM_CONSTANTS.MIN_SEARCH_LENGTH,
  debounceMs: number = INVOICE_FORM_CONSTANTS.SEARCH_DEBOUNCE_MS
) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSearchQueryRef = useRef<string>('')

  const handleComplete = () => setIsSearching(false)

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    if (query.length < minLength) {
      setIsSearching(false)
      lastSearchQueryRef.current = ''
      return
    }

    if (query === lastSearchQueryRef.current) {
      return
    }

    debounceTimeoutRef.current = setTimeout(() => {
      lastSearchQueryRef.current = query
      setIsSearching(true)

      try {
        const result = searchFunction(query)

        if (result instanceof Promise) {
          result.then(handleComplete, handleComplete)
        } else {
          handleComplete()
        }
      } catch (error) {
        handleComplete()
      }
    }, debounceMs)
  }, [query, searchFunction, minLength, debounceMs])

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery)
  }

  const resetSearch = () => {
    setQuery('')
    lastSearchQueryRef.current = ''
    setIsSearching(false)
  }

  return {
    query,
    isSearching,
    updateQuery,
    resetSearch,
  }
}
