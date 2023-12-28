// Utilisation de react-query pour gérer les requêtes de données
import { useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Product } from '../types/Product'

// Hook pour obtenir tous les produits
export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ['products'],
    // Utilisation du client API pour obtenir les données
    queryFn: async () => (await apiClient.get<Product[]>(`api/products`)).data,
  })

// Hook pour obtenir les détails d'un produit par son slug
export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ['products', slug],
    // Utilisation du client API pour obtenir les données
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/slug/${slug}`)).data,
  })
