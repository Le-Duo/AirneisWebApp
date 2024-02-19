export type Product = {
  _id: string
  name: string
  slug: string
  URLimage: string
  category?: { name: string }
  price: number
  description: string
  stock?: number
  priority?: boolean
}
