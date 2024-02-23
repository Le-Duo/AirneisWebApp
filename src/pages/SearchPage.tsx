import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  FormControl,
  Placeholder,
  Offcanvas, // Ensure Offcanvas is imported
} from "react-bootstrap";
import useSearch from "../hooks/searchHook";
import { Product } from "../types/Product";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { ConvertProductToCartItem } from "../utils";
import { useContext } from "react";
import { Store } from "../Store";
import { CartItem } from "../types/Cart";
import { FaArrowUp, FaArrowDown, FaMagnifyingGlass, FaSliders, FaArrowDownUpAcrossLine } from "react-icons/fa6";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [inStock, setInStock] = useState<boolean | undefined>(undefined);
  const [displayResults, setDisplayResults] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<"recommended" | "price (asc)" | "price (desc)">("recommended");
  const lastSearchParams = useRef<{
    searchText: string;
    minPrice: number | undefined;
    maxPrice: number | undefined;
  }>({
    searchText: "",
    minPrice: undefined,
    maxPrice: undefined,
  });

  const [showFilter, setShowFilter] = useState(false);

  const handleClose = () => setShowFilter(false);
  const handleShow = () => setShowFilter(true);

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
    categories: categories.length > 0 ? categories : undefined,
    inStock: inStock,
  };

  const {
    data: searchResults,
    isLoading: loading,
    error,
  } = useSearch(searchParams);

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  useEffect(() => {
    if (!loading && searchResults) {
      let results = searchResults;
      if (sortOrder !== "recommended") {
        results = [...results].sort(
          (a, b) => sortOrder === "price (asc)" ? Number(a.price) - Number(b.price) : Number(b.price) - Number(a.price)
        );
      }
      setDisplayResults(results);
      lastSearchParams.current = searchParams;
    }
  }, [searchResults, loading, searchParams, sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const goToProductPage = (slug: string) => {
    navigate(`/product/${slug}`);
  };

  const addToCartHandler = (product: Product) => {
    const existItem = cart.cartItems.find(
      (x: CartItem) => x._id === product._id
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.stock && product.stock < quantity) {
      toast.warn("Sorry. Product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...ConvertProductToCartItem(product), quantity },
    });
    toast.success("Product added to cart");
  };

  const handleSortByPrice = () => {
    setSortOrder((prevOrder) => {
      if (prevOrder === "recommended") return "price (asc)";
      if (prevOrder === "price (asc)") return "price (desc)";
      return "recommended";
    });
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
      <Row className="justify-content-center">
        <Col md={6} className="search-area">
          <Button
            style={{ backgroundColor: "transparent", borderColor: "transparent" }}
            onClick={handleShow} // Adjusted to open the Offcanvas
          >
            <FaSliders />
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
              <Button variant="outline-primary" type="submit">
              <FaMagnifyingGlass />
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row className="justify-content-md-center">
            <Col className="mt-4" md="auto">
              <h2>Results</h2>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs="auto">
              <Button size="sm" variant="secondary" onClick={handleSortByPrice} style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}>
                {sortOrder === "price (asc)" && <FaArrowUp />}
                {sortOrder === "price (desc)" && <FaArrowDown />}
                {sortOrder === "recommended" && <FaArrowDownUpAcrossLine />}
                Sort by: {sortOrder}
              </Button>
            </Col>
          </Row>
          {loading && (
            <Placeholder as="p" animation="glow">
              <Placeholder xs={12} />
            </Placeholder>
          )}
          {error && <p>Error: {error.message}</p>}
          <Row className="mt-3">
            {displayResults && displayResults.length > 0
              ? displayResults.map((product: Product) => (
                  <Col
                    key={product._id}
                    xs={12}
                    md={4}
                    className="mb-3"
                    onClick={() => goToProductPage(product.slug)}
                    style={{ cursor: "pointer" }}
                  >
                    <Card>
                      <Card.Img variant="top" src={product.URLimage} />
                      <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>£ {product.price}</Card.Text>
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCartHandler(product);
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
      {/* Offcanvas Component for Filters */}
      <Offcanvas show={showFilter} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
                  {/* Place your filter options here */}
        <Form>
          <InputGroup className="mb-3">
            <InputGroup.Text>Min Price</InputGroup.Text>
            <FormControl
              aria-label="Minimum price"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Max Price</InputGroup.Text>
            <FormControl
              aria-label="Maximum price"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </InputGroup>
          {/* Example for categories (simplified for brevity) */}
          <Form.Check 
            label="Category 1" 
            onChange={(e) => setCategories([...categories, 'Category1'])} 
          />
          <Form.Check 
            label="In Stock" 
            type="checkbox" 
            onChange={(e) => setInStock(e.target.checked)} 
          />
          <Button variant="primary" onClick={handleClose}>Apply Filters</Button>
        </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SearchPage;
