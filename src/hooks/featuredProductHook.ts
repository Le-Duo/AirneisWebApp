import { useQuery, UseQueryResult, useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { FeaturedProduct } from '../types/FeaturedProduct'

export const useCreateFeaturedProductMutation = () => {
  return useMutation<FeaturedProduct, Error, FeaturedProduct>({
    mutationFn: async (featuredProduct: FeaturedProduct) => {
      const response = await apiClient.post<FeaturedProduct>(`api/featuredProducts`, featuredProduct)
      return response.data
    },
  })
}

export const useGetFeaturedProductsQuery = (): UseQueryResult<FeaturedProduct[], Error> => {
  return useQuery({
    queryKey: ['getFeaturedProducts'],
    queryFn: async () => {
      const featuredProducts = (await apiClient.get('api/featuredProducts')).data
      return featuredProducts
    },
  })
}

export const useUpdateFeaturedProductMutation = () => {
  return useMutation<FeaturedProduct, Error, { id: string, order: number }>({
    mutationFn: async ({ id, order }) => {
      const response = await apiClient.put<FeaturedProduct>(`api/featuredProducts/${id}`, { order })
      return response.data
    },
  })
}

export const useDeleteFeaturedProductMutation = () => {
  return useMutation<{ message: string }, Error, string>({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<{ message: string }>(`api/featuredProducts/${id}`)
      return response.data
    },
  })
}
