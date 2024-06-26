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
  onProductUpdate: () => void
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  show,
  onHide,
  product,
  onProductUpdate,
}) => {
  const [editedProduct, setEditedProduct] = useState<Product>({
    ...product,
    URLimages: product.URLimages || []
  })
  const updateProduct = useUpdateProductMutation()
  const updateStock = useUpdateStockMutation()
  const createStock = useCreateStockMutation()
  const { data: stockData } = useGetStockByProductIdQuery(product._id || '');
const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();

  useEffect(() => {
    setEditedProduct({
      ...product,
      URLimages: product.URLimages || []
    })
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

  const handleURLChange = (value: string, index: number) => {
    const updatedURLs = [...editedProduct.URLimages];
    updatedURLs[index] = value;
    setEditedProduct(prev => ({ ...prev, URLimages: updatedURLs }));
  };

  const addURLField = () => {
    setEditedProduct(prev => ({ ...prev, URLimages: [...prev.URLimages, ''] }));
  };

  const removeURLField = (index: number) => {
    const updatedURLs = [...editedProduct.URLimages];
    updatedURLs.splice(index, 1);
    setEditedProduct(prev => ({ ...prev, URLimages: updatedURLs }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const stockUpdatePayload = {
      productId: editedProduct._id,
      quantity: editedProduct.stock || 0,
    }
    try {
      if (editedProduct._id) {
        if (stockData) {
          await updateStock.mutateAsync(stockUpdatePayload as { productId: string; quantity: number; })
        } else {
          await createStock.mutateAsync(stockUpdatePayload as { productId: string; quantity: number; })
        }
        await updateProduct.mutateAsync(editedProduct)
        onProductUpdate()
      } else {
        console.error('Product ID is undefined');
      }
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
          {editedProduct.URLimages?.map((url, index) => (
            <Form.Group key={index} className="mb-3">
              <Form.Label>URL Image {index + 1}</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  value={url}
                  onChange={(e) => handleURLChange(e.target.value, index)}
                  className="me-2"
                />
                <Button variant="danger" onClick={() => removeURLField(index)}>
                  Remove
                </Button>
              </div>
            </Form.Group>
          )) || []}
          <Button variant="secondary" onClick={addURLField} className="mb-3">
            Add Another Image URL
          </Button>
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
