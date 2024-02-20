import { useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  FormControl,
  Collapse,
} from 'react-bootstrap'
import useSearch from '../hooks/searchHook'
import { Product } from '../types/Product'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { ConvertProductToCartItem } from '../utils'
import { useContext } from 'react'
import { Store } from '../Store'
import { CartItem } from '../types/Cart'

const SearchPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search)

  const [searchQuery, setSearchQuery] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [open, setOpen] = useState(false)
  const [displayResults, setDisplayResults] = useState<Product[]>([])
  const lastSearchParams = useRef<{
    searchText: string
    minPrice: number | undefined
    maxPrice: number | undefined
  }>({
    searchText: '',
    minPrice: undefined,
    maxPrice: undefined,
  })

  useEffect(() => {
    setOpen(false) // Ensure filters are initially offscreen
    const queryText = query.get('query')
    if (queryText) {
      setSearchQuery(queryText)
    }
  }, [query])

  const searchParams = {
    searchText: searchQuery,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  }

  const {
    data: searchResults,
    isLoading: loading,
    error,
  } = useSearch(searchParams)

  const { state, dispatch } = useContext(Store)
  const { cart } = state

  useEffect(() => {
    if (!loading && searchResults) {
      setDisplayResults(searchResults)
      lastSearchParams.current = searchParams
    }
  }, [searchResults, loading, searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false) // Close filters on search
  }

  const goToProductPage = (slug: string) => {
    navigate(`/product/${slug}`)
  }

  const addToCartHandler = (product: Product) => {
    const existItem = cart.cartItems.find(
      (x: CartItem) => x._id === product._id
    )
    const quantity = existItem ? existItem.quantity + 1 : 1
    if (product.stock && product.stock < quantity) {
      toast.warn('Sorry. Product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...ConvertProductToCartItem(product), quantity },
    })
    toast.success('Product added to cart')
  }

  return (
    <>
      <Helmet>
        <title>Search Results</title>
      </Helmet>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h1>Search</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            onClick={() => setOpen(!open)}
            aria-controls="filter-collapse"
            aria-expanded={open}
          >
            Filter
          </Button>
          <Form onSubmit={handleSearch} className="search-form">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search..."
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-secondary" type="submit">
                Search
              </Button>
            </InputGroup>
          </Form>
          <Row className="justify-content-md-center">
            <Col md="auto">
              <h2>Results</h2>
            </Col>
          </Row>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {displayResults && displayResults.length > 0 ? (
            <Row>
              {displayResults.map((product: Product) => (
                <Col
                  key={product._id}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={3}
                  onClick={() => goToProductPage(product.slug)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card>
                    <Card.Img variant="top" src={product.URLimage} />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>{product.description}</Card.Text>
                      <Button
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCartHandler(product)
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            !loading && <p>No results found</p>
          )}
        </Col>
        <Col md={3} className="filter-sidebar">
          <Collapse in={open}>
            <div id="filter-collapse">
              <Form.Group className="mb-3">
                <Form.Label>Minimum Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Maximum Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </Form.Group>
            </div>
          </Collapse>
        </Col>
      </Row>
    </>
  )
}

export default SearchPage
