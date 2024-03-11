import apiClient from '../apiClient'
import { CartItem, ShippingAddress } from '../types/Cart'
import { Order } from '../types/Order'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useGetOrderDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: async () => (await apiClient.get<Order>(`/api/orders/${id}`)).data,
  })

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: {
      orderItems: CartItem[]
      shippingAddress: ShippingAddress
      paymentMethod: string
      itemsPrice: number
      shippingPrice: number
      taxPrice: number
      totalPrice: number
      user: string
      isPaid: boolean
      isDelivered: boolean
    }) => (await apiClient.post<Order>('/api/orders', order)).data,
  })

export const useUpdateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: Partial<Order> & { orderNumber: string }) =>
      (
        await apiClient.put<{ message: string; order: Order }>(
          `/api/orders/${order.orderNumber}`,
          order
        )
      ).data,
  })

export const useDeleteOrderMutation = () => {
  return useMutation({
    mutationFn: async (orderId: string) => {
      await apiClient.delete(`/api/orders/${orderId}`)
    },
  })
}

export const useGetOrderHistoryQuery = () =>
  useQuery({
    queryKey: ['order-history'],
    queryFn: async () => (await apiClient.get<Order[]>(`/api/orders/mine`)).data,
  })

export const useGetOrdersQuery = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await apiClient.get('/api/orders')
      return response.data
    },
  })
}
