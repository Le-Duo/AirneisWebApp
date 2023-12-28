import { Product } from '../types/Product'
import { Link } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap'
import { useContext } from 'react'
import { Store } from '../Store'
import { CartItem } from '../types/Cart'
import { ConvertProductToCartItem } from '../utils'

function ProductItem({ product }: { product: Product }) {
  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state

  const addToCartHandler = async (item: CartItem) => {
    const existItem = cartItems.find((x) => x._id === item._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    if (product.countInStock < quantity) {
      alert('Sorry, product is out of stock')
      return
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
  }
  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.URLimage}
          className="card-img-top"
          alt={product.name}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text>£{product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button
            onClick={() => addToCartHandler(ConvertProductToCartItem(product))}
          >
            Add to Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}
export default ProductItem
