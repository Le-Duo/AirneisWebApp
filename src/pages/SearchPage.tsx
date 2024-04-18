import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Row, Col, Button, Form, InputGroup, FormControl, Offcanvas } from 'react-bootstrap';
import { Product } from '../types/Product';
import { useState, useEffect } from 'react';
import { FaMagnifyingGlass, FaFilter } from 'react-icons/fa6';
import { useSearchProducts } from '../hooks/searchHook';
import { useGetCategoriesQuery } from '../hooks/categoryHook';
import { useGetUniqueMaterialsQuery } from '../hooks/productHook';
import ProductItem from '../components/ProductItem';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const [searchQuery, setSearchQuery] = useState(query.get('query') || '');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState(query.get('sortBy') || '');
  const [sortOrder, setSortOrder] = useState(query.get('sortOrder') || 'asc');

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
    sortBy: sortBy as 'price' | 'dateAdded' | 'inStock' | undefined,
    sortOrder: sortOrder as 'asc' | 'desc' | undefined,
  });

  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useGetCategoriesQuery();

  const { data: uniqueMaterials, isLoading: isLoadingMaterials, isError: isErrorMaterials } = useGetUniqueMaterialsQuery();

  useEffect(() => {
    setMinPrice(query.get('minPrice') ? Number(query.get('minPrice')) : undefined);
    setMaxPrice(query.get('maxPrice') ? Number(query.get('maxPrice')) : undefined);
    setSelectedCategories(query.get('categories')?.split(',') ?? []);
    setSelectedMaterials(query.get('materials')?.split(',') ?? []);
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      query: searchQuery,
      ...(minPrice && { minPrice: String(minPrice) }),
      ...(maxPrice && { maxPrice: String(maxPrice) }),
      ...(selectedCategories.length > 0 && { categories: selectedCategories.join(',') }),
      ...(selectedMaterials.length > 0 && { materials: selectedMaterials.join(',') }),
      ...(sortBy && { sortBy }),
      ...(sortBy && { sortOrder }), // Include sortOrder only if sortBy has a value
    }).toString();
    navigate(`/search?${params}`);
  };

  const handleClose = () => setShowFilter(false);
  const handleShow = () => setShowFilter(true);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      query: searchQuery,
      ...(minPrice && { minPrice: String(minPrice) }),
      ...(maxPrice && { maxPrice: String(maxPrice) }),
      ...(selectedCategories.length > 0 && { categories: selectedCategories.join(',') }),
      ...(selectedMaterials.length > 0 && { materials: selectedMaterials.join(',') }),
      ...(sortBy && { sortBy }),
      ...(sortBy && { sortOrder }), // Include sortOrder only if sortBy has a value
    }).toString();
    navigate(`/search?${params}`);
    setShowFilter(false);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setShowFilter(false);
    navigate('/search');
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
              <FormControl placeholder="Search..." aria-label="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <Button variant="outline-primary" type="submit">
                <FaMagnifyingGlass />
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      <Offcanvas show={showFilter} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleFilterSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="minPrice">
                  <Form.Label>Minimum Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Min Price"
                    value={minPrice || ''}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="maxPrice">
                  <Form.Label>Maximum Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice || ''}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
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
                      value={category.name}
                      checked={selectedCategories.includes(category.name)}
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
            <Row className="mt-3">
              <Col md={12}>
                <Form.Label>Materials</Form.Label>
                {isLoadingMaterials ? (
                  <p>Loading materials...</p>
                ) : isErrorMaterials ? (
                  <p>Error loading materials</p>
                ) : (
                  uniqueMaterials?.map((material) => (
                    <Form.Check
                      key={material}
                      type="checkbox"
                      id={`material-${material}`}
                      label={material.charAt(0).toUpperCase() + material.slice(1)} // Capitalize the first letter
                      value={material}
                      checked={selectedMaterials.includes(material)}
                      onChange={(e) => {
                        const materialValue = e.target.value;
                        if (e.target.checked) {
                          setSelectedMaterials([...selectedMaterials, materialValue]);
                        } else {
                          setSelectedMaterials(selectedMaterials.filter((m) => m !== materialValue));
                        }
                      }}
                    />
                  ))
                )}
              </Col>
            </Row>
            <Form.Group controlId="sortBy">
              <Form.Label>Sort By</Form.Label>
              <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Default</option>
                <option value="price">Price</option>
                <option value="dateAdded">Newest</option>
                <option value="inStock">In Stock</option>
              </Form.Select>
            </Form.Group>

            {sortBy && (
              <Form.Group controlId="sortOrder">
                <Form.Label>Sort Order</Form.Label>
                <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Form.Select>
              </Form.Group>
            )}
            <Button variant="primary" type="submit" className="mt-3">
              Apply Filters
            </Button>
            <Button variant="danger" type="button" className="mt-3" onClick={resetFilters}>
              Reset Filters
            </Button>
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
                <Col xs={12} md={4} key={product._id} className="mb-3">
                  <ProductItem product={product} stockQuantity={product.quantity} />
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

export default SearchPage;
