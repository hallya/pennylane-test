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

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    if (query && query.length >= minLength && query !== lastSearchQueryRef.current) {
      debounceTimeoutRef.current = setTimeout(() => {
        lastSearchQueryRef.current = query
        setIsSearching(true)
        Promise.resolve(searchFunction(query)).finally(() => {
          setIsSearching(false)
        })
      }, debounceMs)
    } else if (query.length < minLength) {
      setIsSearching(false)
      lastSearchQueryRef.current = ''
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
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