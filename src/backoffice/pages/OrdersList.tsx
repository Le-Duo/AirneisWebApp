import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { useGetOrdersQuery } from '../../hooks/orderHooks' // Supposons que ce hook existe

const OrdersList = () => {
  const { data: orders, error, isLoading } = useGetOrdersQuery()
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching orders</div>

  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
    } else {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  return (
    <div>
      <h2>Liste des Commandes</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Date</th>
            <th>Client</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order._id} onClick={() => handleSelectOrder(order._id)}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order._id)}
                  onChange={() => {}}
                />
              </td>
              <td>{order._id}</td>
              <td>{order.date}</td>
              <td>{order.client}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default OrdersList
