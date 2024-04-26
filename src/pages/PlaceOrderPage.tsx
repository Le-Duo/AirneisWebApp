import { Link, useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import { ApiError } from '../types/APIError'
import { getError } from '../utils'
import { toast } from 'react-toastify'
import { useContext, useEffect, useState } from 'react'
import { useCreateOrderMutation } from '../hooks/orderHook'
import CheckoutSteps from '../components/CheckoutSteps'
import { Helmet } from 'react-helmet-async'
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import LoadingBox from '../components/LoadingBox'
import { useTranslation } from 'react-i18next'

export default function PlaceOrderPage() {
  const { t } = useTranslation();
  const navigate = useNavigate()

  const { state, dispatch } = useContext(Store)
  const { cart } = state

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100

  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  )
  cart.shippingPrice =
    cart.itemsPrice < 400
      ? round2(39)
      : cart.itemsPrice <= 1000
      ? round2(59)
      : round2(109)
  cart.taxPrice = round2(0.2 * cart.itemsPrice)
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice

  const { mutateAsync: createOrder } = useCreateOrderMutation()
  const [isLoading, setIsLoading] = useState(false)

  const placeOrderHandler = async () => {
    try {
      setIsLoading(true)
      const data = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: {
          user: state.userInfo?._id || '',
          fullName: cart.shippingAddress.fullName,
          street: cart.shippingAddress.street,
          city: cart.shippingAddress.city,
          postalCode: cart.shippingAddress.postalCode,
          country: cart.shippingAddress.country,
          phoneNumber: cart.shippingAddress.phoneNumber,
        },
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        user: state.userInfo?._id || '',
        isPaid: false,
        isDelivered: false,
      })
      console.log(data)
      if (data && data._id) {
        dispatch({ type: 'CART_CLEAR' })
        localStorage.removeItem('cartItems')
        navigate(`/order/${data._id}`)
      } else {
        toast.error(t('Unexpected response structure from order creation API.'))
      }
    } catch (err) {
      toast.error(getError(err as ApiError))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment')
    }
  }, [cart, navigate])

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>{t('Place Order')}</title>
      </Helmet>
      <h1 className="my-3">{t('Preview Order')}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{t('Shipping')}</Card.Title>
              <Card.Text>
                <strong>{t('Name')}:</strong> {cart.shippingAddress.fullName} <br />
                <strong>{t('Address')}:</strong> {cart.shippingAddress.street},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">{t('Edit')}</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{t('Payment')}</Card.Title>
              <Card.Text>
                <strong>{t('Method')}:</strong> {t(cart.paymentMethod)}
              </Card.Text>
              <Link to="/payment">{t('Edit')}</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{t('Items')}</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>£{item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">{t('Edit')}</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>{t('Order Summary')}</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>{t('Items')}</Col>
                    <Col>£{cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>{t('Shipping')}</Col>
                    <Col>£{cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>{t('Tax')}</Col>
                    <Col>£{cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>{t('Total')}</Col>
                    <Col>£{cart.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0 || isLoading}
                    >
                      {t('Place Order')}
                    </Button>
                    {isLoading && <LoadingBox></LoadingBox>}
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
