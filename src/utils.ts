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
    image: product.URLimages[0] || '',
    description: product.description,
    price: product.price,
    stock: product.stock!,
    quantity: 1,
    category: product.category,
  }
  return cartItem
}
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
};

export const truncateTextByNumberOfLines = (text: string, maxLines: number): string => {
  const lines = text.split('\n');
  if (lines.length > maxLines) {
    return lines.slice(0, maxLines).join('\n');
  }
  return text;
};

