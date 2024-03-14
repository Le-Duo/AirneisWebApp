import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { Order, OrderStatus } from '../../types/Order'
import { useUpdateOrderMutation } from '../../hooks/orderHook'

interface EditOrderModalProps {
  show: boolean
  onHide: () => void
  order: Order
  onOrderUpdate: () => void
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ show, onHide, order, onOrderUpdate }) => {
  const [editedOrder, setEditedOrder] = useState<Order>({
    ...order,
    status: order.status,
  })
  const { mutateAsync: updateOrder } = useUpdateOrderMutation()

  useEffect(() => {
    setEditedOrder({
      ...order,
      status: order.status,
    })
  }, [order])

  const handleChange = (name: string, value: string) => {
    setEditedOrder(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateOrder(editedOrder)
      onOrderUpdate()
    } catch (error) {
      console.error('Error updating order:', error)
    } finally {
      onHide()
    }
  }

  return (
    <Modal show={show} onHide={onHide} size='lg' scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Edit Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>Status</Form.Label>
            <Form.Control
              as='select'
              name='status'
              value={editedOrder.status}
              onChange={e => handleChange(e.target.name, e.target.value)}
            >
              {Object.values(OrderStatus).map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button type='submit'>Update</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default EditOrderModal
