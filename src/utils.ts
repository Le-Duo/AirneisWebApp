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

export const truncateTextByLines = (text: string, maxLines: number, charsPerLine: number): string => {
  const maxChars = maxLines * charsPerLine;
  let lineCount = 0;
  let lastIndex = 0;

  for (let i = 0; i < text.length && lineCount < maxLines; i++) {
    if (text[i] === '\n' || i - lastIndex >= charsPerLine) {
      lineCount++;
      lastIndex = i;
    }
  }

  if (lineCount >= maxLines) {
    return `${text.substring(0, lastIndex)}...`;
  }

  return text;
};