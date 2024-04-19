import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import ProductItem from '../components/ProductItem';
import { useGetProductDetailsBySlugQuery, useGetSimilarProductsQuery } from '../hooks/productHook'
import { ApiError } from '../types/APIError'
import { Product } from '../types/Product'
import { getError } from '../utils'
import { useContext } from 'react'
import { Store } from '../Store'
import { toast } from 'react-toastify'
import { ConvertProductToCartItem } from '../utils'
import { useNavigate } from 'react-router-dom'

// Page produit
export default function ProductPage() {
  // Récupération du slug du produit depuis l'URL
  const { slug } = useParams()
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  // Utilisation du hook pour obtenir les détails du produit
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug!)

  const categoryId = product?.category?._id ?? '';
  const productId = product?._id ?? '';
  const {
    data: similarProducts = [],
  } = useGetSimilarProductsQuery(categoryId, productId);

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product!._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    if (product!.stock && product!.stock < quantity) {
      toast.warn('Sorry. Product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...ConvertProductToCartItem(product!), quantity },
    })
    toast.success('Product added to cart')
  }

  // Gestion des différents états de la requête
  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">
      {getError(error as unknown as ApiError)}
    </MessageBox>
  ) : !product ? (
    <MessageBox variant="danger">Product Not Found</MessageBox>
  ) : (
    // Affichage du produit
    <div>
      <Row>
        <Col md={4}>
          <img
            className="large"
            src={product.URLimages[0]}
            alt={product.name}
          ></img>
        </Col>
        <Col md={5}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>Price : £{product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description:
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
                    <Col>Price:</Col>
                    <Col>£{product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.stock && product.stock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.stock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {similarProducts && (
  <div>
    <h2 className="text-center my-3">Similar Products</h2>
    <Row className="justify-content-center">
      {similarProducts.map((item: Product) => (
        <Col key={item._id} sm={12} md={4}>
          <ProductItem product={item} />
        </Col>
      ))}
    </Row>
  </div>
)}
    </div>
  )
}
