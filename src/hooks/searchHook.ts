import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

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
  const response = await axios.post<SearchResult[]>(
    '/api/products/search',
    params
  )
  return response.data
}

const useSearch = (params: SearchParams) => {
  return useQuery<SearchResult[]>(
    ['searchResults', params],
    () => fetchSearchResults(params),
    {
      enabled: !!params.searchText,
    }
  )
}

export default useSearch
