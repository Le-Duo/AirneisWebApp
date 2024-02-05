import { useState } from 'react'
import { Table } from 'react-bootstrap'
import { useGetProductsQuery } from '../../hooks/productHook'
import { useGetStockQuery } from '../../hooks/StockHook' // Corrected casing to match file system

const ProductsList = () => {
  const { data: products, error, isLoading } = useGetProductsQuery()

  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching products</div>

  const handleSelectProduct = (productId: string) => {
    // Added type annotation
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  return (
    <div>
      <h2>Liste des Produits</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Nom</th>
            <th>Slug</th>
            <th>URLimage</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {products?.map(
            (
              product: Product // Added type annotation
            ) => (
              <tr
                key={product._id}
                onClick={() => handleSelectProduct(product._id)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => {}}
                  />
                </td>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.slug}</td>
                <td>{product.URLimage}</td>
                <td>{product.category.name}</td>{' '}
                {/* Adjusted to match Product type */}
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.description}</td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default ProductsList
