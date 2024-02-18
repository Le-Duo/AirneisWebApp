import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Row, Col, Card, Button } from 'react-bootstrap'
import useSearch from '../hooks/searchHook'
import { Product } from '../types/Product'

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const SearchPage = () => {
  const query = useQuery()
  const searchQuery = query.get('query') || ''

  // Prepare search parameters
  const searchParams = {
    searchText: searchQuery,
    // Add other parameters as needed
  }

  // Use the custom search hook
  const {
    data: searchResults,
    isLoading: loading,
    error,
  } = useSearch(searchParams)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      <Helmet>
        <title>Search Results</title>
      </Helmet>
      <h2>Search Results</h2>
      {searchResults && searchResults.length > 0 ? (
        <Row>
          {searchResults.map((product: Product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <Card.Img variant="top" src={product.URLimage} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <Button variant="primary">View Product</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No results found</p>
      )}
    </>
  )
}

export default SearchPage
