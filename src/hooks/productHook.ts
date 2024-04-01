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
        URLimages: product.URLimages,
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
        products.map((p: Product) => p.URLimages)
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
        productDetails.URLimages
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

export const useDeleteProductMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await apiClient.delete(`api/products/${id}`)
        return response.data
      } catch (error) {
        console.error('Error deleting product:', error)
        throw new Error('Error deleting product')
      }
    },
  })
}

export const useCreateProductMutation = () => {
  return useMutation<Product, Error, Product, unknown>({
    mutationFn: async (product: Product): Promise<Product> => {
      console.log('Creating product:', product);
      const response = await apiClient.post<Product>('api/products', {
        name: product.name,
        URLimages: product.URLimages,
        slug: product.slug,
        categoryId: product.category?._id,
        description: product.description,
        materials: product.materials,
        price: product.price,
        _id: product._id,
      });
      console.log('Product created successfully:', response.data);
      return response.data;
    },
    onError: (error: Error) => {
      console.error('Error creating product:', error);
    },
    onSuccess: (data: Product) => {
      console.log('Product creation successful:', data);
    },
  });
}