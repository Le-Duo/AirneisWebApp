import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Table, Button, Form } from 'react-bootstrap'
import { Order, OrderStatus } from '../../types/Order'
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from '../../hooks/orderHooks'

const OrdersList = () => {
  const { data: orders, error, isLoading, refetch } = useGetOrdersQuery()
  const updateOrderMutation = useUpdateOrderMutation()
  const deleteOrderMutation = useDeleteOrderMutation()
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState<OrderStatus>(
    OrderStatus.Initiated
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching orders</div>

  const handleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
    } else {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  const handleEdit = (order: Order) => {
    setEditingOrderId(order._id)
    setEditStatus(order.status)
  }

  const handleSave = async () => {
    if (editingOrderId) {
      await updateOrderMutation.mutateAsync({
        _id: editingOrderId,
        status: editStatus,
      })
      setEditingOrderId(null)
      refetch()
    }
  }

  const handleDelete = async (orderId: string) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this order?'
    )
    if (isConfirmed) {
      await deleteOrderMutation.mutateAsync(orderId)
      refetch()
    }
  }

  return (
    <div>
      <Helmet>
        <title>Orders List</title>
      </Helmet>
      <h2>Orders List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Items</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order: Order) => (
            <tr key={order._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order._id)}
                  onChange={() => handleSelectOrder(order._id)}
                />
              </td>
              <td>{order._id}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                {typeof order.user === 'object'
                  ? order.user.name
                  : 'User name not available'}
              </td>
              <td>
                {editingOrderId === order._id ? (
                  <Form.Control
                    as="select"
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(e.target.value as OrderStatus)
                    }
                  >
                    {Object.values(OrderStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Control>
                ) : (
                  order.status
                )}
              </td>
              <td>
                {order.orderItems
                  .reduce((acc, item) => {
                    const existingItem = acc.find(
                      (accItem) => accItem.name === item.name
                    )
                    if (existingItem) {
                      existingItem.quantity += item.quantity
                    } else {
                      acc.push({ ...item })
                    }
                    return acc
                  }, [] as { name: string; quantity: number }[])
                  .map((item) => `${item.name} (x${item.quantity})`)
                  .join(', ')}
              </td>
              <td>{order.totalPrice}</td>
              <td>
                {editingOrderId === order._id ? (
                  <>
                    <Button variant="success" onClick={handleSave}>
                      Save
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(order._id)}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => handleEdit(order)}>Edit</Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(order._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default OrdersList
