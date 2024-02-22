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
  Placeholder,
} from 'react-bootstrap'
import useSearch from '../hooks/searchHook'
import { Product } from '../types/Product'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { ConvertProductToCartItem } from '../utils'
import { useContext } from 'react'
import { Store } from '../Store'
import { CartItem } from '../types/Cart'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa6'

const SearchPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search)

  const [searchQuery, setSearchQuery] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [open, setOpen] = useState(false)
  const [displayResults, setDisplayResults] = useState<Product[]>([])
  const [isSortedByPrice, setIsSortedByPrice] = useState(false)
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
    setOpen(false)
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
      let results = searchResults
      if (isSortedByPrice) {
        results = [...results].sort((a, b) => Number(a.price) - Number(b.price))
      }
      setDisplayResults(results)
      lastSearchParams.current = searchParams
    }
  }, [searchResults, loading, searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
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

  const handleSortByPrice = () => {
    setIsSortedByPrice(!isSortedByPrice)
  }

  const sortedOrUnsortedResults = isSortedByPrice
    ? [...displayResults].sort((a, b) => Number(a.price) - Number(b.price))
    : displayResults

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
      <Row className="justify-content-center">
        <Col md={6} className="search-area">
          <Button
            onClick={() => setOpen(!open)}
            aria-controls="filter-collapse"
            aria-expanded={open}
          >
            Filter
          </Button>
          <Form onSubmit={handleSearch} className="search-form">
            <InputGroup>
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
        </Col>
      </Row>
      <Row>
        <Col>
          <Row className="justify-content-md-center">
            <Col md="auto">
              <h2>Results</h2>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs="auto">
              <Button size="sm" variant="secondary" onClick={handleSortByPrice}>
                {isSortedByPrice ? <FaArrowUp /> : <FaArrowDown />}
                Sort by: price ({isSortedByPrice ? 'asc' : 'des'})
              </Button>
            </Col>
          </Row>
          {loading && (
            <Placeholder as="p" animation="glow">
              <Placeholder xs={12} />
            </Placeholder>
          )}
          {error && <p>Error: {error.message}</p>}
          <Row>
            {sortedOrUnsortedResults && sortedOrUnsortedResults.length > 0
              ? sortedOrUnsortedResults.map((product: Product) => (
                  <Col
                    key={product._id}
                    xs={12}
                    md={4}
                    className="mb-3"
                    onClick={() => goToProductPage(product.slug)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card>
                      <Card.Img variant="top" src={product.URLimage} />
                      <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>
                          {product.description.length > 100
                            ? `${product.description.substring(0, 100)}...`
                            : product.description}
                        </Card.Text>
                        <Card.Text>£ {product.price}</Card.Text>
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
                ))
              : !loading && <p>No results found</p>}
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default SearchPage
