import { Category } from './Category'

export type Product = {
  _id?: string
  name: string
  slug: string
  URLimage: string
  category?: Category
  description: string
  materials: string[]
  price: number
  stock?: number
  priority?: boolean
  quantity?: number
}
