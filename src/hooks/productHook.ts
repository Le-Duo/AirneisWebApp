import { useQuery, UseQueryResult, useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Product } from '../types/Product'
import { Stock } from '../types/Stock'

export const useUpdateProductMutation = () => {
  return useMutation<Product, Error, Product>({
    mutationFn: async (product: Product) => {
      const payload: any = {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        URLimage: product.URLimage,
        price: product.price,
        description: product.description,
        stock: product.stock,
        priority: product.priority,
      }

      // Conditionally add category if it exists
      if (product.category) {
        payload.category = { ...product.category }
      }

      const response = await apiClient.put<Product>(`api/products/${product._id}`, payload)
      return response.data
    },
    onSuccess: () => {
      // This can be overridden by the component using this hook
    },
  })
}

export const useGetProductsQuery = (category: string | null): UseQueryResult<Product[], Error> => {
  return useQuery({
    queryKey: ['getProducts', category],
    queryFn: async () => {
      const endpoint = category ? `api/products?category=${category}` : 'api/products'
      const products = (await apiClient.get(endpoint)).data
      console.log(
        'Fetched products with URLimage:',
        products.map((p: Product) => p.URLimage)
      )
      const stocks = (await apiClient.get('api/stocks')).data
      console.log('Stocks data fetched successfully:', stocks)

      const productsWithStock = products.map((product: Product) => {
        const stock = stocks.find((stock: Stock) => stock.product._id === product._id)?.quantity
        return {
          ...product,
          stock: stock,
        }
      })

      return productsWithStock
    },
  })
}

export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ['products', slug],
    queryFn: async () => {
      console.log(
        `Fetching product details for slug: ${slug} using useGetProductDetailsBySlugQuery`
      )
      const productDetails = (await apiClient.get<Product>(`api/products/slug/${slug}`)).data
      console.log(
        `Fetched product details for slug: ${slug} with URLimage:`,
        productDetails.URLimage
      )
      console.log(`Product details fetched successfully for slug: ${slug}:`, productDetails)

      const stocks = (await apiClient.get('api/stocks')).data
      const productStock = stocks.find(
        (stock: Stock) => stock.product._id === productDetails._id
      )?.quantity

      return {
        ...productDetails,
        stock: productStock,
      }
    },
  })
export const useGetUniqueMaterialsQuery = (): UseQueryResult<string[], Error> => {
  return useQuery({
    queryKey: ['getUniqueMaterials'],
    queryFn: async () => {
      const products = (await apiClient.get<Product[]>('api/products')).data
      const allMaterials = products.flatMap(product => product.materials)
      const uniqueMaterials = Array.from(new Set(allMaterials))
      return uniqueMaterials
    },
  })
}
