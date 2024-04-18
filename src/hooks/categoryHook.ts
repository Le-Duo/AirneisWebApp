// Utilisation de react-query pour gérer les requêtes de données
import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Category } from '../types/Category'

// Hook pour obtenir toutes les catégories
export const useGetCategoriesQuery = () =>
  useQuery({
    queryKey: ['categories'],
    // Utilisation du client API pour obtenir les données
    queryFn: async () =>
      (await apiClient.get<Category[]>(`api/categories`)).data,
  })

// Hook pour obtenir les détails d'une catégorie par son slug
export const useGetCategoryDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ['categories', slug],
    // Utilisation du client API pour obtenir les données
    queryFn: async () =>
      (await apiClient.get<Category>(`api/categories/slug/${slug}`)).data,
  })

export const useCreateCategoryMutation = () => {
  return useMutation({
    mutationFn: async (category: Category) =>
      (await apiClient.post<Category>(`api/categories`, category)).data,
  })
}

export const useUpdateCategoryMutation = () => {
  return useMutation({
    mutationFn: async (category: Category) =>
      (await apiClient.put<Category>(`api/categories/${category._id}`, category)).data,
  })
}

export const useDeleteCategoryMutation = () => {
  return useMutation({
    mutationFn: async (categoryId: string) =>
      (await apiClient.delete(`api/categories/${categoryId}`)).data,
  })
}

