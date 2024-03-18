import { CreditCard } from './CreditCard'

export type UserInfo = {
  _id: string
  name: string
  email: string
  isAdmin: boolean
  address: UserAddress
  paymentCards : CreditCard[]
}

export type UserAddress = {
  street: string
  city: string
  postalCode: string
  country: string
}
