import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from 'react-bootstrap';
import { Order, OrderStatus } from '../../types/Order';
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from '../../hooks/orderHooks';
import Table from "../components/Table";

const OrdersList = () => {
  const { data: orders, error, isLoading, refetch } = useGetOrdersQuery();
  const updateOrderMutation = useUpdateOrderMutation();
  const [editingOrderId, setEditingOrderId] = React.useState<string | null>(null);
  const [editStatus, setEditStatus] = React.useState<OrderStatus | null>(null);
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching orders</div>;

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

  const columns = [
    { _id: 'id', key: '_id', label: 'ID' },
    { _id: 'date', key: 'createdAt', label: 'Date', renderer: (order: Order) => new Date(order.createdAt).toLocaleString() },
    { _id: 'customer', key: 'user', label: 'Customer', renderer: (order: Order) => typeof order.user === 'object' ? order.user : 'User name not available' },
    { _id: 'status', key: 'status', label: 'Status' },
    { _id: 'items', key: 'orderItems', label: 'Items', renderer: (order: Order) => order.orderItems.map(item => `${item.name} (x${item.quantity})`).join(', ') },
    { _id: 'total', key: 'totalPrice', label: 'Total' },
  ];

  return (
    <div>
      <Helmet>
        <title>Orders List</title>
      </Helmet>
      <h2>Orders List</h2>
      <Table
        data={orders || []}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(order) => handleDelete(order)}
      />
    </div>
  );
};

export default OrdersList;
