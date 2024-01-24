// Utilisation de react-query pour gérer les requêtes de données
import { useQuery } from '@tanstack/react-query'
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
