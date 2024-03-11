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
  Offcanvas,
} from "react-bootstrap";
import { Product } from "../types/Product";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ConvertProductToCartItem } from "../utils";
import { useContext } from "react";
import { Store } from "../Store";
import { CartItem } from "../types/Cart";
import { FaMagnifyingGlass, FaFilter } from "react-icons/fa6";
import { useSearchProducts } from "../hooks/searchHook";
import { useGetCategoriesQuery } from '../hooks/categoryHook';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const {
    data: displayResults,
    isLoading,
    isError,
  } = useSearchProducts({
    searchText: query.get("query") ?? undefined,
    minPrice,
    maxPrice,
    categories: query.get("categories")?.split(",") ?? undefined,
    inStock: query.get("inStock") === "true",
    materials: query.get("materials")?.split(",") ?? undefined,
    sortBy: query.get("sortBy") as "asc" | "desc" | undefined,
    sortOrder: query.get("sortOrder") as "asc" | "desc" | undefined,
  });

  useEffect(() => {
    const queryText = query.get("query");
    const minPriceQuery = query.get("minPrice");
    const maxPriceQuery = query.get("maxPrice");
    const categoriesQuery = query.get("categories");
    const materialsQuery = query.get("materials");

    if (queryText !== null) {
      setSearchQuery(queryText);
    }
    setMinPrice(minPriceQuery ? Number(minPriceQuery) : undefined);
    setMaxPrice(maxPriceQuery ? Number(maxPriceQuery) : undefined);
    setSelectedCategories(categoriesQuery ? categoriesQuery.split(",") : []);
    setSelectedMaterials(materialsQuery ? materialsQuery.split(",") : []);
  }, [location.search]);

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchQuery)}` + 
      (minPrice ? `&minPrice=${minPrice}` : '') + 
      (maxPrice ? `&maxPrice=${maxPrice}` : '') +
      (selectedCategories.length > 0 ? `&categories=${selectedCategories.join(',')}` : '') +
      (selectedMaterials.length > 0 ? `&materials=${selectedMaterials.join(',')}` : '')
    );
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
      payload: {
        ...ConvertProductToCartItem(product),
        quantity,
      },
    });
    toast.success("Product added to cart");
  };

  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useGetCategoriesQuery();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedCategories(selectedOptions);
  };

  const [showFilter, setShowFilter] = useState(false);

  const handleClose = () => setShowFilter(false);
  const handleShow = () => setShowFilter(true);

  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    // Construct the query string
    const queryParams = new URLSearchParams({
      query: searchQuery, // Assuming you want to keep the search query as part of the filters
      ...(minPrice && { minPrice: String(minPrice) }),
      ...(maxPrice && { maxPrice: String(maxPrice) }),
      ...(selectedCategories.length > 0 && { categories: selectedCategories.join(',') }),
      ...(selectedMaterials.length > 0 && { materials: selectedMaterials.join(',') }),
    }).toString();

    // Navigate to the updated URL
    navigate(`/search?${queryParams}`);
    setShowFilter(false); // Close the Offcanvas
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
          
      <Button variant="primary" onClick={handleShow}>
        <FaFilter /> Filter
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

      <Offcanvas show={showFilter} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleFilterSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="minPrice">
                  <Form.Label>Minimum Price</Form.Label>
                  <Form.Control type="number" placeholder="Min Price" value={minPrice || ''} onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="maxPrice">
                  <Form.Label>Maximum Price</Form.Label>
                  <Form.Control type="number" placeholder="Max Price" value={maxPrice || ''} onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Label>Categories</Form.Label>
                {isLoadingCategories ? (
                  <p>Loading categories...</p>
                ) : isErrorCategories ? (
                  <p>Error loading categories</p>
                ) : (
                  categories?.map((category) => (
                    <Form.Check 
                      key={category._id}
                      type="checkbox"
                      id={`category-${category._id}`}
                      label={category.name}
                      value={category.slug}
                      checked={selectedCategories.includes(category.slug)}
                      onChange={(e) => {
                        const slug = e.target.value;
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, slug]);
                        } else {
                          setSelectedCategories(selectedCategories.filter((sc) => sc !== slug));
                        }
                      }}
                    />
                  ))
                )}
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Label>Materials</Form.Label>
                {["Wood", "Metal", "Plastic"].map((material) => (
                  <Form.Check 
                    key={material}
                    type="checkbox"
                    id={`material-${material}`}
                    label={material}
                    value={material.toLowerCase()}
                    checked={selectedMaterials.includes(material.toLowerCase())}
                    onChange={(e) => {
                      const materialValue = e.target.value;
                      if (e.target.checked) {
                        setSelectedMaterials([...selectedMaterials, materialValue]);
                      } else {
                        setSelectedMaterials(selectedMaterials.filter((m) => m !== materialValue));
                      }
                    }}
                  />
                ))}
              </Col>
            </Row>
            <Button variant="primary" type="submit">Apply Filters</Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
      <Row>
        <Col>
          <Row className="justify-content-md-center">
            <Col className="my-4" md="auto">
              <h2>Results</h2>
            </Col>
          </Row>
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p>Error fetching results.</p>
          ) : displayResults && displayResults.length > 0 ? (
            <Row className="mx-lg-5">
              {displayResults.map((product: Product) => (
                <Col xs={12} lg={4} key={product._id} className="mb-3">
                  <Card
                    style={{ cursor: "pointer" }}
                  >
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
              ))}
            </Row>
          ) : (
            <p>No results found</p>
          )}
        </Col>
      </Row>
    </>
  );
};

export default SearchPage
