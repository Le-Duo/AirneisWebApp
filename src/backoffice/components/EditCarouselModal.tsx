import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { CarouselItem } from '../../types/Carousel'
import { useUpdateCarouselItemMutation } from '../../hooks/carouselHook'

interface EditCarouselModalProps {
  show: boolean
  onHide: () => void
  carousel: CarouselItem
  onCarouselUpdate: () => void
}

const EditCarouselModal: React.FC<EditCarouselModalProps> = ({
  show,
  onHide,
  carousel,
  onCarouselUpdate,
}) => {
  const { mutate: updateCarouselItem, status } = useUpdateCarouselItemMutation()
  const isLoading = status === 'pending' // Adjusted to use 'pending' instead of 'loading'
  const [editedCarousel, setEditedCarousel] = useState<CarouselItem>(carousel) // Use full CarouselItem

  const handleChange = (name: string, value: string) => {
    setEditedCarousel(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateCarouselItem(editedCarousel, {
        onSuccess: () => {
          onCarouselUpdate() // Invoke onCarouselUpdate on successful update
        },
      }) // Use the corrected function with onSuccess callback
    } catch (error) {
      console.error('Error updating carousel:', error)
    } finally {
      onHide()
    }
  }

  useEffect(() => {
    setEditedCarousel(carousel) // Update to use the full carousel item
  }, [carousel])

  return (
    <Modal show={show} onHide={onHide} size='lg' scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Edit Carousel Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type='text'
              value={editedCarousel.src}
              onChange={e => handleChange('src', e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Alt Text</Form.Label>
            <Form.Control
              type='text'
              value={editedCarousel.alt}
              onChange={e => handleChange('alt', e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Caption</Form.Label>
            <Form.Control
              type='text'
              value={editedCarousel.caption}
              onChange={e => handleChange('caption', e.target.value)}
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

export default EditCarouselModal
