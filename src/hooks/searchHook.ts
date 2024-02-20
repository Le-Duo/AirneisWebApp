import { useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient'

interface SearchParams {
  searchText: string
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
  const response = await apiClient.post<SearchResult[]>(
    '/api/products/search',
    params
  )
  return response.data
}

const useSearch = (params: SearchParams) => {
  return useQuery<SearchResult[]>(
    {
      queryKey: ['searchResults', params],
      queryFn: () => fetchSearchResults(params),
      enabled: !!params.searchText,
    }
  )
}

export default useSearch
