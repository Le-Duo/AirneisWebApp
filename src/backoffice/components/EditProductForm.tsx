import React, { useState, useEffect } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import { useUpdateProductMutation } from '../../hooks/productHook'
import { Product } from '../../types/Product'
import { Category } from '../../types/Category'

interface EditProductFormProps {
  product: Product
  onSave: (product: Product) => void
  categories: Category[] | undefined
}

const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  onSave,
  categories = [],
}) => {
  const [formState, setFormState] = useState({
    slug: product.slug,
    categoryId: product.category.name,
    price: product.price,
    stock: product.stock ?? 0,
    description: product.description,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const firstInput = document.querySelector('input')
    firstInput?.focus()
  }, [])

  const updateProductMutation = useUpdateProductMutation()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const updatedProduct = {
        ...product,
        ...formState,
        category:
          categories.find((c) => c._id === formState.categoryId) ||
          product.category,
      }
      const serializableProduct = {
        _id: updatedProduct._id,
        name: updatedProduct.name,
        slug: updatedProduct.slug,
        URLimage: updatedProduct.URLimage,
        category: { name: updatedProduct.category.name },
        price: updatedProduct.price,
        description: updatedProduct.description,
        stock: updatedProduct.stock,
      }
      await updateProductMutation.mutateAsync(serializableProduct)
      setIsSaved(true)
      setError('')
      onSave(serializableProduct)
    } catch (e) {
      console.error(e)
      setError('Failed to save product. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getImageSrc = (URLimage: { props: { src: string } } | string): string => {
    if (typeof URLimage === 'object' && URLimage.props && typeof URLimage.props.src === 'string') {
      return URLimage.props.src;
    }
    return URLimage as string;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div>
        <img
          id="productImage"
          src={getImageSrc(product.URLimage)}
          alt={product.name}
          style={{ width: '50vh', marginBottom: '20px' }}
        />
      </div>
      <div style={{ marginLeft: '20px' }}>
        <Form>
          {error && <Alert variant="danger">{error}</Alert>}
          {isSaved && (
            <Alert variant="success">Product saved successfully!</Alert>
          )}
          <h3>{product.name}</h3>
          <Form.Group controlId="formProductSlug">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="text"
              value={formState.slug}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  slug: e.target.value,
                }))
              }
              placeholder="Slug"
            />
          </Form.Group>
          <Form.Group controlId="formCategoryName">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              value={formState.categoryId}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  categoryId: e.target.value,
                }))
              }
            >
              {categories.map((category, index) => (
                <option key={index} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formProductPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={formState.price.toString()}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  price: parseFloat(e.target.value),
                }))
              }
              placeholder="Price"
            />
          </Form.Group>
          <Form.Group controlId="formProductStock">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              value={formState.stock.toString()}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  stock: parseInt(e.target.value, 10),
                }))
              }
              placeholder="Stock"
            />
          </Form.Group>
          <Form.Group controlId="formProductDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={formState.description}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  description: e.target.value,
                }))
              }
              placeholder="Description"
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default EditProductForm
