import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { Store } from '../Store'
import { CartItem } from '../types/Cart'
import { toast } from 'react-toastify'
import { Col, Row, ListGroup, Button, Card } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import MessageBox from '../components/MessageBox'
import { useTranslation } from 'react-i18next'

export default function CartPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    state: {
      mode,
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store)

  const updateCartHandler = (item: CartItem, quantity: number) => {
    if (item.stock < quantity) {
      toast.warn(t('Sorry. Product is out of stock'))
      return
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
  }
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping')
  }
  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }

  return (
    <div>
      <Helmet>
        <title>{t('Shopping Cart')}</title>
      </Helmet>
      <h1>{t('Shopping Cart')}</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              {t('Cart is empty.')} <Link to="/">{t('Go Shopping')}</Link>
            </MessageBox>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item: CartItem) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded thumbnail"
                      ></img>
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        variant={mode}
                        disabled={item.quantity === 1}
                      >
                        <i className="fa-solid fa-minus-circle"></i>
                      </Button>
                      {''}
                      <span>{item.quantity}</span>
                      <Button
                        variant={mode}
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.stock}
                      >
                        <i className="fa-solid fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>£{item.price}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant={mode}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    {t('Subtotal')} ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    {t('items')}) : £
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      className="primary"
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                    >
                      {t('Proceed to Checkout')}
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
