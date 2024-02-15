import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import Table from '../components/Table'
import {
  useGetProductsQuery,
  useUpdateProductMutation,
} from '../../hooks/productHook'
import { useGetCategoriesQuery } from '../../hooks/categoryHook'
import Popup from '../components/Popup'
import EditProductForm from '../components/EditProductForm'
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
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState<JSX.Element | string>('')
  const updateProductMutation = useUpdateProductMutation()

  const adjustedProducts = useMemo(
    () =>
      products?.map((product) => ({
        ...product,
        categoryName: product.category?.name,
        URLimage: (
          <img
            src={product.URLimage}
            alt={product.name}
            style={{ width: '100px' }}
          />
        ),
      })) || [],
    [products]
  )

  const columns = useMemo(
    () => [
      { key: 'URLimage', label: 'Image' },
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'URL' },
      { key: 'categoryName', label: 'Category' },
      { key: 'price', label: 'Price' },
      { key: 'stock', label: 'Stock' },
      { key: 'description', label: 'Description' },
      { key: 'priority', label: 'Priority' },
    ],
    []
  )

  const handleEdit = (product: Product) => {
    setPopupContent(
      <EditProductForm
        product={product}
        onSave={handleSaveProduct}
        categories={categories || []}
      />
    )
    setShowPopup(true)
  }

  const handleSaveProduct = async (editedProduct: Product) => {
    await updateProductMutation.mutateAsync(editedProduct, {
      onSuccess: () => {
        setShowPopup(false)
        refetch()
      },
    })
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
      <Popup
        show={showPopup}
        onHide={() => setShowPopup(false)}
        title="Product Details"
        content={popupContent}
      />
    </div>
  )
}

export default ProductsList
