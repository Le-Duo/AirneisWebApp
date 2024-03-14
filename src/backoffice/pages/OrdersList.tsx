import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Table from '../components/Table'
import EditOrderModal from '../components/EditOrderModal'
import { useGetOrdersQuery, useDeleteOrderMutation } from '../../hooks/orderHook'
import { Order, OrderStatus } from '../../types/Order'
import { Column } from '../components/Table'

const OrdersList = () => {
  const { data: orders, error, isLoading, refetch } = useGetOrdersQuery()
  const deleteOrderMutation = useDeleteOrderMutation()
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState<OrderStatus | null>(null)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching orders</div>

  const handleEdit = (order: Order) => {
    setEditingOrderId(order._id)
    setEditStatus(order.status)
    setCurrentOrder(order)
  }

  const handleDelete = async (order: Order) => {
    await deleteOrderMutation.mutateAsync(order._id)
    refetch()
  }

  const columns: Column<Order>[] = [
    { _id: 'id', key: '_id', label: 'ID' },
    {
      _id: 'date',
      key: 'createdAt',
      label: 'Date',
      renderer: (order: Order) => new Date(order.createdAt).toLocaleString(),
    },
    {
      _id: 'customer',
      key: 'user',
      label: 'Customer',
      renderer: (order: Order) => {
        if (typeof order.user === 'object' && order.user !== null) {
          return order.user.name || 'User name not available'
        }
        return 'User name not available'
      },
    },
    { _id: 'status', key: 'status', label: 'Status' },
    {
      _id: 'items',
      key: 'orderItems',
      label: 'Items',
      renderer: (order: Order) =>
        order.orderItems.map(item => `${item.name} (x${item.quantity})`).join(', '),
    },
    { _id: 'total', key: 'totalPrice', label: 'Total' },
  ]

  return (
    <div>
      <Helmet>
        <title>Orders List</title>
      </Helmet>
      <h2>Orders List</h2>
      <Table data={orders || []} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
      {currentOrder && (
        <EditOrderModal
          show={editingOrderId !== null}
          onHide={() => setEditingOrderId(null)}
          order={currentOrder}
          onOrderUpdate={refetch}
        />
      )}
    </div>
  )
}

export default OrdersList
