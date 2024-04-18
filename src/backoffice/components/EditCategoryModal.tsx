import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { Category } from '../../types/Category'
import { useUpdateCategoryMutation } from '../../hooks/categoryHook'

interface EditCategoryModalProps {
  show: boolean
  onHide: () => void
  category: Category
  onCategoryUpdate: () => void
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  show,
  onHide,
  category,
  onCategoryUpdate,
}) => {
  const { mutate: updateCategory, status } = useUpdateCategoryMutation()
  const isLoading = status === 'pending'
  const [editedCategory, setEditedCategory] = useState<Category>(category)

  const handleChange = (name: string, value: string) => {
    setEditedCategory(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateCategory(editedCategory, {
        onSuccess: () => {
          onCategoryUpdate()
        },
      })
    } catch (error) {
      console.error('Error updating category:', error)
    } finally {
      onHide()
    }
  }

  useEffect(() => {
    setEditedCategory(category)
  }, [category])

  return (
    <Modal show={show} onHide={onHide} size='lg' scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Edit Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type='text'
              value={editedCategory.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Slug</Form.Label>
            <Form.Control
              type='text'
              value={editedCategory.slug}
              onChange={e => handleChange('slug', e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              value={editedCategory.description}
              onChange={e => handleChange('description', e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type='text'
              value={editedCategory.urlImage}
              onChange={e => handleChange('urlImage', e.target.value)}
            />
          </Form.Group>

          <Button type='submit' disabled={isLoading}>
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default EditCategoryModal
