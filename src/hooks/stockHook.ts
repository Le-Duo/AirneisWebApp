import { useQuery, UseQueryResult, useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Stock } from '../types/Stock'

export const useGetStockQuery = (): UseQueryResult<Stock[], Error> => {
  return useQuery<Stock[], Error>({
    queryKey: ['getStock'],
    queryFn: async () => {
      const { data } = await apiClient.get('api/stocks')
      return data
    },
  })
}

export const useGetStockByProductIdQuery = (productId: string): UseQueryResult<Stock, Error> => {
  return useQuery<Stock, Error>({
    queryKey: ['getStock', productId],
    queryFn: async () => {
      const { data } = await apiClient.get(`api/stocks/products/${productId}`)
      return data
    },
  })
}

export const useUpdateStockMutation = () => {
  return useMutation<Stock, Error, { productId: string; quantity: number }>({
    mutationFn: async ({ productId, quantity }) => {
      const { data } = await apiClient.put(`api/stocks/products/${productId}`, {
        quantity,
      })
      return data
    },
  })
}

export const useCreateStockMutation = () => {
  return useMutation<Stock, Error, { productId: string; quantity: number }>({
    mutationFn: async ({ productId, quantity }) => {
      const { data } = await apiClient.post('api/stocks', {
        productId,
        quantity,
      })
      return data
    },
  })
}
