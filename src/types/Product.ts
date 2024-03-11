import { Category } from './Category'

export type Product = {
  _id: string
  name: string
  slug: string
  URLimage: string
  category?: Category
  price: number
  description: string
  materials: string[]
  stock?: number
  priority?: boolean
}
