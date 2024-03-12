import { Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import ProductItem from "../components/ProductItem";
// Import useSearchProducts instead of useGetProductsQuery
import { useSearchProducts } from "../hooks/searchHook";
import { getError } from "../utils";
import { ApiError } from "../types/APIError";
import { Product } from "../types/Product";
import { useLocation } from "react-router-dom";

export default function ProductsPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  // Use useSearchProducts when category is present
  const {
    data: products,
    error,
    isLoading,
  } = useSearchProducts({
    categories: category ? [category] : undefined,
  });

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">
      {getError(error as unknown as ApiError)}
    </MessageBox>
  ) : (
    <Col>
      <Row className="justify-content-md-center">
        <Col className="my-4" md="auto">
          <h2>{category}</h2>
        </Col>
      </Row>
      <Row className="mx-lg-5">
        <Helmet>
          <title>Products</title>
        </Helmet>
        {products &&
          products.map((product: Product) => (
            <Col xs={12} lg={4} key={product.slug} className="mt-3">
              <ProductItem product={product} />
            </Col>
          ))}
      </Row>
    </Col>
  );
}
