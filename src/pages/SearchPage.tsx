import { useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Row, Col, Card, Button, Form, InputGroup, FormControl, Placeholder } from 'react-bootstrap'
import { Product } from '../types/Product'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { ConvertProductToCartItem } from '../utils'
import { useContext } from 'react'
import { Store } from '../Store'
import { CartItem } from '../types/Cart'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { useSearchProducts } from '../hooks/searchHook' // Importing the custom search hook

const SearchPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search)

  const [searchQuery, setSearchQuery] = useState('')
  // Using the custom search hook
  const { data: displayResults, isLoading, isError } = useSearchProducts({
    searchText: query.get('query') || '',
    price: query.get('price'),
    categories: query.get('categories'),
    inStock: query.get('inStock'),
    materials: query.get('materials'),
    sortBy: query.get('sortBy'),
    sortOrder: query.get('sortOrder'),
  })

  useEffect(() => {
    const queryText = query.get('query')
    setSearchQuery(queryText || '')
  }, [query])

  const { state, dispatch } = useContext(Store)
  const { cart } = state

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?query=${searchQuery}`);
  }

  const goToProductPage = (slug: string) => {
    navigate(`/product/${slug}`)
  }

  const addToCartHandler = (product: Product) => {
    const existItem = cart.cartItems.find((x: CartItem) => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    if (product.stock && product.stock < quantity) {
      toast.warn('Sorry. Product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        ...ConvertProductToCartItem(product),
        quantity,
      },
    })
    toast.success('Product added to cart')
  }

  return (
    <>
      <Helmet>
        <title>Search Results</title>
      </Helmet>
      <Row className='justify-content-md-center'>
        <Col md='auto'>
          <h1>Search</h1>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col md={6} className='search-area'>
          <Form onSubmit={handleSearch} className='search-form'>
            <InputGroup>
              <FormControl
                placeholder='Search...'
                aria-label='Search'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <Button variant='outline-primary' type='submit'>
                <FaMagnifyingGlass />
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row className='justify-content-md-center'>
            <Col className='mt-4' md='auto'>
              <h2>Results</h2>
            </Col>
          </Row>
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error fetching results.</p>
          ) : displayResults && displayResults.length > 0 ? (
            displayResults.map((product: Product) => (
              <Col
                key={product._id}
                xs={12}
                md={4}
                className='mb-3'
                onClick={() => goToProductPage(product.slug)}
                style={{
                  cursor: 'pointer',
                }}
              >
                <Card>
                  <Card.Img variant='top' src={product.URLimage} />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>£ {product.price}</Card.Text>
                    <Button
                      variant='primary'
                      onClick={e => {
                        e.stopPropagation()
                        addToCartHandler(product)
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No results found</p>
          )}
        </Col>
      </Row>
    </>
  )
}

export default SearchPage

