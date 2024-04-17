import { Category } from './Category'

export type Product = {
  _id?: string
  name: string
  slug: string
  URLimages: string[]
  category?: Category
  description: string
  materials: string[]
  price: number
  stock?: number
  priority?: boolean
  quantity?: number
}
