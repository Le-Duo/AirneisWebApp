import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useGetProductsQuery } from './productHook' // Step 1: Import useGetProductsQuery
import apiClient from '../apiClient'
import { useEffect, useState } from 'react'

interface SearchParams {
  searchText?: string
  minPrice?: number
  maxPrice?: number
  categories?: string[]
  inStock?: boolean
  materials?: string[]
  sortBy?: 'price' | 'dateAdded' | 'inStock'
  sortOrder?: 'asc' | 'desc'
}

interface SearchResult {
  _id: string
  name: string
  description: string
  price: number
  URLimage: string
  stock: number
  slug: string
  category: { name: string }
}

const fetchSearchResults = async (params: SearchParams) => {
  // Adjust parameters before sending
  const adjustedParams = {
    ...params,
    categories: params.categories?.join(','), // Convert array to comma-separated string
    inStock: params.inStock, // Ensure inStock is correctly interpreted
  }

  const response = await apiClient.post<SearchResult[]>(
    '/api/products/search',
    adjustedParams
  )
  return response.data
}

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

const useSearch = (params: SearchParams) => {
  const queryClient = useQueryClient()
  const debouncedParams = useDebounce(params, 500)

  useEffect(() => {
    const prefetchSearchResults = async () => {
      await queryClient.prefetchQuery({
        queryKey: ['searchResults', debouncedParams],
        queryFn: () => fetchSearchResults(debouncedParams),
      })
    }
    if (debouncedParams.searchText) {
      prefetchSearchResults()
    }
  }, [debouncedParams, queryClient])

  if (!params.searchText) {
    return useGetProductsQuery(null)
  }

  return useQuery<SearchResult[]>({
    queryKey: ['searchResults', debouncedParams],
    queryFn: () => fetchSearchResults(debouncedParams),
    enabled: !!debouncedParams.searchText,
  })
}

export default useSearch
