import { useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Product } from '../types/Product'

interface SearchParams {
  searchText?: string;
  minPrice?: number; 
  maxPrice?: number;
  categories?: string[];
  inStock?: boolean;
  materials?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface SearchResults {
  results: Product[];
  totalResults: number;
}   

export const useSearchProducts = ({
  searchText,
  minPrice,
  maxPrice,
  categories,
  inStock,
  materials,
  sortBy,
  sortOrder,
  page=1,
  limit=6
}: SearchParams) => {
  return useQuery<SearchResults, Error>({
    queryKey: ['searchProducts', { searchText, minPrice, maxPrice, categories, inStock, materials, sortBy, sortOrder, page, limit }],
    queryFn: () => apiClient.get('/api/products/search', {
      params: {
        searchText,
        minPrice,
        maxPrice,
        categories: categories?.join(','),
        inStock,
        materials: materials?.join(','),
        sortBy,
        sortOrder,
        page,
        limit
      },
    }).then(res => res.data)
  });
};
