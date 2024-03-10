export type UserInfo = {
  _id: string
  name: string
  email: string
  isAdmin: boolean
  address: UserAddress
}

export type UserAddress = {
  street: string
  city: string
  postalCode: string
  country: string
}
