// Utilisation de react-query pour gérer les requêtes de données
import { useQuery, UseQueryResult, useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Product } from '../types/Product'
import { Stock } from '../types/Stock'

// Add useUpdateProductMutation hook
export const useUpdateProductMutation = () => {
  return useMutation<Product, Error, Product>({
    mutationFn: async (product: Product) => {
      // Create a new object with only the necessary, serializable fields
      const payload = {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        URLimage: product.URLimage,
        category: { name: product.category.name }, // Assuming category is required and always present
        price: product.price,
        description: product.description,
        stock: product.stock,
      }
      const response = await apiClient.put<Product>(
        `api/products/${product._id}`,
        payload
      )
      return response.data
    },
  })
}

export const useGetProductsQuery = (
  category: string | null
): UseQueryResult<Product[], Error> => {
  return useQuery({
    queryKey: ['getProducts', category],
    queryFn: async () => {
      console.log(
        'Fetching products data using useGetProductsQuery for category:',
        category
      )
      const endpoint = category
        ? `api/products?category=${category}`
        : 'api/products'
      const products = (await apiClient.get(endpoint)).data
      console.log(
        'Fetched products with URLimage:',
        products.map((p: Product) => p.URLimage)
      )
      const stocks = (await apiClient.get('api/stocks')).data
      console.log('Stocks data fetched successfully:', stocks)

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
        `Fetched product details for slug: ${slug} with URLimage:`,
        productDetails.URLimage
      )
      console.log(
        `Product details fetched successfully for slug: ${slug}:`,
        productDetails
      )

      // Récupération des données de stock pour le produit
      const stocks = (await apiClient.get('api/stocks')).data
      const productStock = stocks.find(
        (stock: Stock) => stock.product._id === productDetails._id
      )?.quantity

      // Ajout de la quantité de stock aux détails du produit
      return {
        ...productDetails,
        stock: productStock, // Assurez-vous que le type Product dans Product.ts accepte stock comme propriété optionnelle
      }
    },
  })
