import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import { Product } from '../../types/Product'
import { useUpdateProductMutation } from '../../hooks/productHook'
import {
  useGetStockByProductIdQuery,
  useUpdateStockMutation,
  useCreateStockMutation,
} from '../../hooks/stockHook'
import { useGetCategoriesQuery } from '../../hooks/categoryHook'
import { Category } from '../../types/Category'

interface EditProductModalProps {
  show: boolean
  onHide: () => void
  product: Product
  categories: Category[]
  onProductUpdate: () => void // Add this prop to signal an update
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  show,
  onHide,
  product,
  categories,
  onProductUpdate, // Add this prop to signal an update
}) => {
  const [editedProduct, setEditedProduct] = useState<Product>(product)
  const updateProduct = useUpdateProductMutation()
  const updateStock = useUpdateStockMutation()
  const createStock = useCreateStockMutation()
  const { data: stockData } = useGetStockByProductIdQuery(product._id)
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery()

  useEffect(() => {
    setEditedProduct(product)
  }, [product])

  useEffect(() => {
    if (stockData) {
      setEditedProduct(prev => ({ ...prev, stock: stockData.quantity }))
    }
  }, [stockData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (name === 'category') {
      if (categoriesData && categoriesData.length > 0) {
        const selectedCategory = categoriesData.find(category => category.name === value)
        if (selectedCategory) {
          setEditedProduct(prev => ({
            ...prev,
            category: selectedCategory,
          }))
        }
      }
    } else {
      setEditedProduct(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const stockUpdatePayload = {
      productId: editedProduct._id,
      quantity: editedProduct.stock || 0,
    }
    try {
      if (stockData) {
        await updateStock.mutateAsync(stockUpdatePayload)
      } else {
        await createStock.mutateAsync(stockUpdatePayload)
      }
      await updateProduct.mutateAsync(editedProduct)
      onProductUpdate()
    } catch (error) {
      console.error('Error updating product or stock:', error)
    }
    onHide()
  }

  return (
    <Modal show={show} onHide={onHide} size='lg' scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              name='name'
              value={editedProduct.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>URL</Form.Label>
            <InputGroup>
              <InputGroup.Text>airneis.com/product/</InputGroup.Text>
              <Form.Control
                type='text'
                name='slug'
                value={editedProduct.slug || ''}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>URL Image</Form.Label>
            <Form.Control
              type='text'
              name='URLimage'
              value={editedProduct.URLimage}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Category</Form.Label>
            <Form.Select
              name='category'
              value={editedProduct.category?.name || ''}
              onChange={handleChange}
              disabled={isLoadingCategories}
            >
              {categoriesData?.map(category => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='number'
              name='price'
              value={editedProduct.price}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              name='description'
              value={editedProduct.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type='number'
              name='stock'
              value={editedProduct.stock || ''}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Check
              type='checkbox'
              label='Priority'
              name='priority'
              checked={editedProduct.priority || false}
              onChange={e =>
                setEditedProduct(prev => ({
                  ...prev,
                  priority: e.target.checked,
                }))
              }
            />
          </Form.Group>
          <Button variant='primary' type='submit'>
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default EditProductModal
