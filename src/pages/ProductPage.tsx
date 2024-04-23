import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { useGetProductDetailsBySlugQuery } from '../hooks/productHook'
import { ApiError } from '../types/APIError'
import { getError } from '../utils'
import { useContext } from 'react'
import { Store } from '../Store'
import { toast } from 'react-toastify'
import { ConvertProductToCartItem } from '../utils'
import { useTranslation } from 'react-i18next'

// Page produit
export default function ProductPage() {
  const { t } = useTranslation();
  // Récupération du slug du produit depuis l'URL
  const { slug } = useParams()
  // Utilisation du hook pour obtenir les détails du produit
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug!)

  const { state, dispatch } = useContext(Store)
  const { cart } = state

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product!._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    if (product!.stock && product!.stock < quantity) {
      toast.warn(t('Sorry. Product is out of stock'))
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...ConvertProductToCartItem(product!), quantity },
    })
    toast.success(t('Product added to cart'))
  }

  // Gestion des différents états de la requête
  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">
      {getError(error as unknown as ApiError)}
    </MessageBox>
  ) : !product ? (
    <MessageBox variant="danger">{t('Product Not Found')}</MessageBox>
  ) : (
    // Affichage du produit
    <div>
      <Row>
        <Col md={6}>
          <img
            className="large"
            src={product.URLimages[0]}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>{t('Price')} : £{product.price}</ListGroup.Item>
            <ListGroup.Item>
              {t('Description')}:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>{t('Price')}:</Col>
                    <Col>£{product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>{t('Status')}:</Col>
                    <Col>
                      {product.stock && product.stock > 0 ? (
                        <Badge bg="success">{t('In Stock')}</Badge>
                      ) : (
                        <Badge bg="danger">{t('Unavailable')}</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.stock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        {t('Add to Cart')}
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
