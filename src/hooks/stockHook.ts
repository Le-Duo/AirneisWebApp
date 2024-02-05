import { useQuery, UseQueryResult } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Stock } from '../types/Stock'

export const useGetStockQuery = (): UseQueryResult<any, Error> => {
  console.log('Fetching stock data using useGetStockQuery')
  return useQuery({
    queryKey: ['getStock'],
    queryFn: async () => {
      const response = await apiClient.get('api/stock')
      console.log('Stock data fetched successfully:', response.data)
      return response.data
    },
  })
}
