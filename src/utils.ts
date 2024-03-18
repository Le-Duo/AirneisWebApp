import { ApiError } from './types/APIError'
import { CartItem } from './types/Cart'
import { Product } from './types/Product'

export const getError = (error: ApiError) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message
}

export const ConvertProductToCartItem = (product: Product): CartItem => {
  const cartItem: CartItem = {
    _id: product._id || '',
    name: product.name,
    slug: product.slug,
    image: product.URLimage,
    price: product.price,
    stock: product.stock ?? 0,
    quantity: 1,
    category: product.category,
  }
  return cartItem
}
