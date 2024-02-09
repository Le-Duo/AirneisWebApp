import { useState, useMemo } from 'react'
import Table from '../components/Table'
import { useGetProductsQuery } from '../../hooks/productHook'
import Popup from '../components/Popup'

const ProductsList = () => {
  const { data: products, error, isLoading } = useGetProductsQuery()
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState<JSX.Element | string>('')

  const columns = useMemo(() => [
    { key: '_id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'URLimage', label: 'Image URL' },
    { key: 'category.name', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
    { key: 'description', label: 'Description' },
  ], [])

  const handleSelectionChange = (selectedItems: { _id: string }[]) => {
    setSelectedProducts(selectedItems.map(item => item._id))
  }

  const handleEdit = (product: any) => {
    const content = (
      <div>
        <h3>{product.name}</h3>
        <img src={product.URLimage} alt={product.name} style={{ width: '50vh', marginBottom: '20px' }} />
        <div>
          <label>Slug: <input type="text" value={product.slug} readOnly /></label>
        </div>
        <div>
          <label>Category: <input type="text" value={product.category.name} readOnly /></label>
        </div>
        <div>
          <label>Price: <input type="text" value={`$${product.price}`} readOnly /></label>
        </div>
        <div>
          <label>Stock: <input type="number" value={product.stock} readOnly /></label>
        </div>
        <div>
          <label>Description: <textarea value={product.description} readOnly /></label>
        </div>
        {/* TODO: Add more fields and make them editable */}
      </div>
    );

    setPopupContent(content);
    setShowPopup(true);
  };

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching products</div>

  return (
    <div>
      <h2>Products List</h2>
      <Table
        data={products || []}
        columns={columns}
        onSelectionChange={handleSelectionChange}
        onEdit={handleEdit}
      />
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