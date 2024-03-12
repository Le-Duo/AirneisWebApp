import { useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Row, Col, Card, Button, Form, InputGroup, FormControl, Offcanvas } from 'react-bootstrap'
import { Product } from '../types/Product'
import { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify'
import { ConvertProductToCartItem } from '../utils'
import { Store } from '../Store'
import { CartItem } from '../types/Cart'
import { FaMagnifyingGlass, FaFilter } from 'react-icons/fa6'
import { useSearchProducts } from '../hooks/searchHook'
import { useGetCategoriesQuery } from '../hooks/categoryHook'
import { useGetUniqueMaterialsQuery } from '../hooks/productHook'

const SearchPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search)
  const { state, dispatch } = useContext(Store)
  const { cart } = state

  const [searchQuery, setSearchQuery] = useState(query.get('query') || '')
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [showFilter, setShowFilter] = useState(false)

  const {
    data: displayResults,
    isLoading,
    isError,
  } = useSearchProducts({
    searchText: searchQuery,
    minPrice,
    maxPrice,
    categories: selectedCategories,
    inStock: query.get('inStock') === 'true',
    materials: selectedMaterials,
    sortBy: query.get('sortBy') as 'asc' | 'desc' | undefined,
    sortOrder: query.get('sortOrder') as 'asc' | 'desc' | undefined,
  })

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useGetCategoriesQuery()

  const {
    data: uniqueMaterials,
    isLoading: isLoadingMaterials,
    isError: isErrorMaterials,
  } = useGetUniqueMaterialsQuery()

  useEffect(() => {
    setMinPrice(query.get('minPrice') ? Number(query.get('minPrice')) : undefined)
    setMaxPrice(query.get('maxPrice') ? Number(query.get('maxPrice')) : undefined)
    setSelectedCategories(query.get('categories')?.split(',') ?? [])
    setSelectedMaterials(query.get('materials')?.split(',') ?? [])
  }, [location.search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?${new URLSearchParams({
      query: searchQuery,
      ...(minPrice && { minPrice: String(minPrice) }),
      ...(maxPrice && { maxPrice: String(maxPrice) }),
      ...(selectedCategories.length > 0 && { categories: selectedCategories.join(',') }),
      ...(selectedMaterials.length > 0 && { materials: selectedMaterials.join(',') }),
    }).toString()}`)
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
      payload: ConvertProductToCartItem(product),
    })
    toast.success('Product added to cart')
  }

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategories(Array.from(event.target.selectedOptions, option => option.value))
  }

  const handleClose = () => setShowFilter(false)
  const handleShow = () => setShowFilter(true)

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?${new URLSearchParams({
      query: searchQuery,
      ...(minPrice && { minPrice: String(minPrice) }),
      ...(maxPrice && { maxPrice: String(maxPrice) }),
      ...(selectedCategories.length > 0 && { categories: selectedCategories.join(',') }),
      ...(selectedMaterials.length > 0 && { materials: selectedMaterials.join(',') }),
    }).toString()}`)
    setShowFilter(false)
  }

  const resetFilters = () => {
    setSearchQuery('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setShowFilter(false);
    navigate('/search');
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
          <Button variant='primary' onClick={handleShow}>
            <FaFilter /> Filter
          </Button>
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

      <Offcanvas show={showFilter} onHide={handleClose} placement='start'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleFilterSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId='minPrice'>
                  <Form.Label>Minimum Price</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Min Price'
                    value={minPrice || ''}
                    onChange={e => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId='maxPrice'>
                  <Form.Label>Maximum Price</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Max Price'
                    value={maxPrice || ''}
                    onChange={e => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className='mt-3'>
              <Col md={12}>
                <Form.Label>Categories</Form.Label>
                {isLoadingCategories ? (
                  <p>Loading categories...</p>
                ) : isErrorCategories ? (
                  <p>Error loading categories</p>
                ) : (
                  categories?.map(category => (
                    <Form.Check
                      key={category._id}
                      type='checkbox'
                      id={`category-${category._id}`}
                      label={category.name}
                      value={category.name}
                      checked={selectedCategories.includes(category.name)}
                      onChange={e => {
                        const slug = e.target.value
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, slug])
                        } else {
                          setSelectedCategories(selectedCategories.filter(sc => sc !== slug))
                        }
                      }}
                    />
                  ))
                )}
              </Col>
            </Row>
            <Row className='mt-3'>
              <Col md={12}>
                <Form.Label>Materials</Form.Label>
                {isLoadingMaterials ? (
                  <p>Loading materials...</p>
                ) : isErrorMaterials ? (
                  <p>Error loading materials</p>
                ) : (
                  uniqueMaterials?.map(material => (
                    <Form.Check
                      key={material}
                      type='checkbox'
                      id={`material-${material}`}
                      label={material.charAt(0).toUpperCase() + material.slice(1)} // Capitalize the first letter
                      value={material}
                      checked={selectedMaterials.includes(material)}
                      onChange={e => {
                        const materialValue = e.target.value
                        if (e.target.checked) {
                          setSelectedMaterials([...selectedMaterials, materialValue])
                        } else {
                          setSelectedMaterials(selectedMaterials.filter(m => m !== materialValue))
                        }
                      }}
                    />
                  ))
                )}
              </Col>
            </Row>
            <Button variant='primary' type='submit' className='mt-3'>
              Apply Filters
            </Button>
            <Button variant='danger' type='button' className='mt-3' onClick={resetFilters}>
              Reset Filters
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
      <Row>
        <Col>
          <Row className='justify-content-md-center'>
            <Col className='my-4' md='auto'>
              <h2>Results</h2>
            </Col>
          </Row>
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error fetching results.</p>
          ) : displayResults && displayResults.length > 0 ? (
            <Row className='mx-lg-5'>
              {displayResults.map((product: Product) => (
                <Col xs={12} lg={4} key={product._id} className='mb-3'>
                  <Card style={{ cursor: 'pointer' }}>
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
              ))}
            </Row>
          ) : (
            <p>No results found</p>
          )}
        </Col>
      </Row>
    </>
  )
}

export default SearchPage
