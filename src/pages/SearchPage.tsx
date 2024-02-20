import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  FormControl,
  Collapse,
} from "react-bootstrap";
import useSearch from "../hooks/searchHook";
import { Product } from "../types/Product";
import { useState, useEffect } from "react";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [open, setOpen] = useState(false); // State to manage the collapsible filter

  const query = useQuery();
  useEffect(() => {
    const queryText = query.get("query");
    if (queryText) {
      setSearchQuery(queryText);
    }
  }, [query]);

  const searchParams = {
    searchText: searchQuery,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  };

  const {
    data: searchResults,
    isLoading: loading,
    error,
  } = useSearch(searchParams);

  const handleSearch = (e) => {
    e.preventDefault();
  };

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
  );
};

export default SearchPage;
