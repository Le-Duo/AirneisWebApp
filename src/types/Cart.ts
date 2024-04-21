import { Category } from "./Category"

export type CartItem = {
  image: string | undefined
  slug: string
  quantity: number
  stock: number
  price: number
  _id: string
  name: string
  category: Category | undefined
}

export type ShippingAddress = {
  fullName: string
  phoneNumber: string
  street: string
  _id?: string
  user?: string
  city: string
  postalCode: string
  country: string
}

export type Cart = {
  cartItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
}
