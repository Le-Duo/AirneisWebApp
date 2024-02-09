import { CartItem, ShippingAddress } from './Cart'
import { User } from './User'

export type Order = {
  status: string
  _id: string
  orderItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  user: User
  createdAt: string
  updatedAt: string
  isPaid: boolean
  paidAt: string
  isDelivered: boolean
  deliveredAt: string
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
}
