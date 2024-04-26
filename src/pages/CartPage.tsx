import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from '../Store';
import { CartItem } from '../types/Cart';
import { toast } from 'react-toastify';
import { Col, Row, ListGroup, Button, Card, Stack } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import { useTranslation } from 'react-i18next';
import { useGetStockByProductIdQuery } from '../hooks/stockHook';
import { truncateTextByNumberOfLines } from '../utils';

export default function CartPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    state: {
      mode,
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store);

  // Fetch stock data for all products in the cart
  const stockQueries = cartItems.map((item) => useGetStockByProductIdQuery(item._id));

  const updateCartHandler = async (item: CartItem, quantity: number) => {
    const stockQuery = stockQueries.find((query) => query.data?.product._id === item._id);
    const currentStock = stockQuery?.data?.quantity;

    if (!currentStock) {
      toast.error(t('Error fetching stock information'));
      return;
    }

    if (currentStock < quantity) {
      toast.warn(t('Sorry. Maximum quantity is '));
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>{t('Shopping Cart')}</h1>
      <Row>
      <Col md={8} className="p-0 p-md-2">
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item: CartItem, index) => (
                <ListGroup.Item key={item._id} className="d-flex align-items-center">
                  <div className="flex-container">
                    <img src={item.image} alt={item.name} className="img-fluid rounded thumbnail fixed-size" />
                    <div className="ms-3 flex-grow">
                      <Link to={`/product/${item.slug}`} className="h5">
                        {item.name}
                      </Link>
                      <p className="small text-muted truncate-text">{item.description}</p>
                    </div>
                    <div className="controls">
                      <Stack gap={0} className="align-items-center">
                        <span className="py-1 px-12 fixed-size">£{item.price}</span>
                        <Stack direction="horizontal" gap={3} className="align-items-center text-center center">
                          <Button
                            onClick={() => updateCartHandler(item, item.quantity - 1)}
                            variant={mode}
                            disabled={item.quantity === 1}
                            className="fixed-size"
                          >
                            <i className="fa-solid fa-minus-circle"></i>
                          </Button>
                          <span className="fixed-size">{item.quantity}</span>
                          <Button
                            variant={mode}
                            onClick={() => updateCartHandler(item, item.quantity + 1)}
                            disabled={item.quantity >= (stockQueries[index].data?.quantity || 0)}
                            className="fixed-size"
                          >
                            <i className="fa-solid fa-plus-circle"></i>
                          </Button>
                        </Stack>
                        <Button onClick={() => removeItemHandler(item)} variant={mode} className="fixed-size">
                          <i className="fa-solid fa-trash-can"></i>
                        </Button>
                      </Stack>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card className="shadow-sm rounded">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3 className="fw-bold">
                    {t('Subtotal')} ({cartItems.reduce((a, c) => a + c.quantity, 0)} {t('items')}): £
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button type="button" className="btn-primary btn-lg w-100" disabled={cartItems.length === 0} onClick={checkoutHandler}>
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
  );
}
