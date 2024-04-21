import { CreditCard } from './CreditCard'

export type UserInfo = {
  _id: string
  name: string
  email: string
  phoneNumber:string
  isAdmin: boolean
  addresses: UserAddress[],
  paymentCards : CreditCard[]
}

export type UserAddress = {
  _id: string
  street: string
  city: string
  postalCode: string
  country: string
  isDefault: boolean
}
