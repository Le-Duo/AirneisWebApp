import { CartItem, ShippingAddress } from './Cart'
import { User } from './User'

export enum OrderStatus {
  Initiated = 'initiated',
  Pending = 'pending',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export type Order = {
  status: OrderStatus
  _id: string
  orderItems: CartItem[] // Consider aligning with the Item model in order.ts if needed
  shippingAddress: ShippingAddress
  paymentMethod: string
  user: User | string // Adjust based on whether you receive a complete User object or just the ID
  createdAt: string
  updatedAt: string
  isPaid: boolean
  paidAt: string | Date // Align with order.ts using Date
  isDelivered: boolean
  deliveredAt: string | Date // Align with order.ts using Date
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
}
