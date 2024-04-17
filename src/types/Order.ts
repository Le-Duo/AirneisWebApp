import { CartItem,ShippingAddress } from './Cart'
import { User } from './User'

export enum OrderStatus {
  Initiated = 'initiated',
  Pending = 'pending',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export type PaymentResult = {
  paymentId: string
  status: string
  update_time: string
  email_address: string
}

export type Order = {
  status: OrderStatus
  _id: string
  orderNumber: string
  orderItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentResult?: PaymentResult
  user: User | string 
  createdAt: string
  updatedAt: string
  isPaid: boolean
  paidAt?: string | Date
  isDelivered: boolean
  deliveredAt?: string | Date
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
}
