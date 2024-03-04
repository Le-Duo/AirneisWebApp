import { useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Product } from '../types/Product'

interface SearchParams {
  searchText?: string;
  price?: string;
  categories?: string[];
  inStock?: boolean;
  materials?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useSearchProducts = ({
  searchText,
  price,
  categories,
  inStock,
  materials,
  sortBy,
  sortOrder,
}: SearchParams) => {
  return useQuery<Product[], Error>({
    queryKey: ['searchProducts', { searchText, price, categories, inStock, materials, sortBy, sortOrder }],
    queryFn: () => apiClient.get('/api/products/search', {
      params: {
        searchText,
        price,
        categories: categories?.join(','),
        inStock,
        materials: materials?.join(','),
        sortBy,
        sortOrder,
      },
    }).then(res => res.data)
  });
};
