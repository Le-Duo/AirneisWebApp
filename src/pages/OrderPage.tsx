import { Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { useGetOrderDetailsQuery } from '../hooks/orderHook'
import { ApiError } from '../types/APIError'
import { getError } from '../utils'
import { useTranslation } from 'react-i18next'

export default function OrderPage() {
  const { t } = useTranslation();
  const params = useParams()
  const { id: orderId } = params

  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId!)

  return isLoading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">
      {getError(error as unknown as ApiError)}
    </MessageBox>
  ) : !order ? (
    <MessageBox variant="danger">{t('Order Not Found')}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>{t('Order')} {orderId}</title>
      </Helmet>
      <h1 className="my-3">{t('Order')} {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{t('Shipping')}</Card.Title>
              <Card.Text>
                <strong>{t('Name')}:</strong> {order.shippingAddress.fullName} <br />
                <strong>{t('Phone Number')}:</strong> {order.shippingAddress.phoneNumber} <br />
                <strong>{t('Address')}: </strong> {order.shippingAddress.street},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  {t('Delivered at')} {order.deliveredAt instanceof Date ? order.deliveredAt.toLocaleString() : order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="warning">{t('Not Delivered')}</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{t('Payment')}</Card.Title>
              <Card.Text>
                <strong>{t('Method')}:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  {t('Paid at')} {order.paidAt instanceof Date ? order.paidAt.toLocaleString() : order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="warning">{t('Not Paid')}</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{t('Items')}</Card.Title>
              <ListGroup variant="flush">
                {order && order.orderItems ? (
                  order.orderItems.map((item) => (
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
                  ))
                ) : (
                  <div>{t('Loading...')}</div>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{t('Order Summary')}</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>{t('Items')}</Col>
                    <Col>£{order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>{t('Shipping')}</Col>
                    <Col>£{order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>{t('Tax')}</Col>
                    <Col>£{order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>{t('Order Total')}</strong>
                    </Col>
                    <Col>
                      <strong>£{order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
