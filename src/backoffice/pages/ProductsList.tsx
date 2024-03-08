import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import Table from '../components/Table'
import EditProductModal from '../components/EditProductModal'
import { useGetProductsQuery } from '../../hooks/productHook'
import { useGetCategoriesQuery } from '../../hooks/categoryHook'
import { Product } from '../../types/Product'

const ProductsList = () => {
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
    refetch,
  } = useGetProductsQuery(null)
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery()

  const [showEditModal, setShowEditModal] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)

  const adjustedProducts = useMemo(
    () =>
      products?.map((product) => ({
        ...product,
        categoryName: product.category?.name,
        URLimage: product.URLimage,
      })) || [],
    [products]
  )

  const columns = useMemo(
    () => [
      {
        key: 'URLimage' as const,
        label: 'Image',
        renderer: (item: Product) => (
          <img src={item.URLimage} alt={item.name} style={{ width: '100px', height: 'auto' }} />
        ),
      },
      { key: 'name' as const, label: 'Name' },
      {
        key: 'slug' as const,
        label: 'URL',
        renderer: (item: Product) => `.../product/${item.slug}`,
      },
      { key: 'categoryName' as const, label: 'Category' },
      { key: 'price' as const, label: 'Price' },
      { key: 'stock' as const, label: 'Stock' },
      { key: 'description' as const, label: 'Description' },
      { key: 'priority' as const, label: 'Priority' },
    ],
    []
  )

  const handleEdit = async (product: Product) => {
    setCurrentProduct(product)
    setShowEditModal(true)
  }

  if (productsLoading || categoriesLoading) return <div>Loading...</div>
  if (productsError || categoriesError) return <div>Error fetching data</div>

  return (
    <div>
      <Helmet>
        <title>Products List</title>
      </Helmet>
      <h2>Products List</h2>
      <Table data={adjustedProducts} columns={columns} onEdit={handleEdit} />
      {currentProduct && categories && (
        <EditProductModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          product={currentProduct}
          categories={categories}
          onProductUpdate={() => refetch()}
        />
      )}
    </div>
  )
}

export default ProductsList
