// Utilisation de react-query pour gérer les requêtes de données
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Product } from '../types/Product'
import { Stock } from '../types/Stock'

export const useGetProductsQuery = (): UseQueryResult<Product[], Error> => {
  return useQuery({
    queryKey: ['getProducts'],
    queryFn: async () => {
      console.log('Fetching products data using useGetProductsQuery')
      const products = (await apiClient.get('api/products')).data
      //console.log('Products data fetched successfully:', products)
      // Assuming each product has a unique ID that matches the stock product reference
      const stocks = (await apiClient.get('api/stocks')).data
      console.log('Stocks data fetched successfully:', stocks)

      // Map stock quantity to its respective product
      const productsWithStock = products.map((product: Product) => {
        const stock = stocks.find(
          (stock: Stock) => stock.product._id === product._id
        )?.quantity
        console.log(`Mapping stock: ${stock} to product ID: ${product._id}`)
        return {
          ...product,
          stock: stock,
        }
      })

      return productsWithStock
    },
  })
}

// Hook pour obtenir les détails d'un produit par son slug
export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ['products', slug],
    // Utilisation du client API pour obtenir les données
    queryFn: async () => {
      console.log(
        `Fetching product details for slug: ${slug} using useGetProductDetailsBySlugQuery`
      )
      const productDetails = (
        await apiClient.get<Product>(`api/products/slug/${slug}`)
      ).data
      console.log(
        `Product details fetched successfully for slug: ${slug}:`,
        productDetails
      )
      return productDetails
    },
  })
