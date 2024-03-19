import { useGetCategoriesQuery } from "../hooks/categoryHook";
import { useGetFeaturedProductsQuery } from "../hooks/featuredProductHook";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import HomeCarousel from "../components/HomeCarousel";
import CookieConsent from "../components/CookieConsent";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import ProductItem from "../components/ProductItem";

export default function HomePage() {
  const navigate = useNavigate();
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useGetCategoriesQuery();
  const {
    data: featuredProducts,
    isLoading: isLoadingFeaturedProducts,
    error: errorFeaturedProducts,
  } = useGetFeaturedProductsQuery();

  if (isLoadingCategories || isLoadingFeaturedProducts) return <LoadingBox />;
  if (errorCategories)
    return <MessageBox variant="danger">Error loading categories</MessageBox>;
  if (errorFeaturedProducts)
    return (
      <MessageBox variant="danger">Error loading featured products</MessageBox>
    );
  if (!Array.isArray(categories))
    return (
      <MessageBox variant="warning">Categories data is not valid</MessageBox>
    );
  if (!Array.isArray(featuredProducts))
    return (
      <MessageBox variant="warning">
        Featured products data is not valid
      </MessageBox>
    );

  return (
    <>
      <CookieConsent />
      <Helmet>
        <title>Home | Airneis</title>
      </Helmet>
      <div className="home-page">
        <HomeCarousel />
        <Container>
          <Row className="justify-content-md-center pt-3">
            <Col md="auto" style={{ fontSize: "24px", fontWeight: "bold" }}>
              FROM THE HIGHLANDS OF SCOTLAND
            </Col>
          </Row>
          <Row className="justify-content-md-center pb-3">
            <Col md="auto" style={{ fontSize: "24px", fontWeight: "bold" }}>
              OUR FURNITURE IS IMMORTAL
            </Col>
          </Row>
        </Container>
        <div className="category-grid">
          <Container>
            <Row>
              {categories.map((category) => (
                <Col
                  xs={12}
                  lg={4}
                  key={category._id}
                  className="d-flex justify-content-center mb-3"
                >
                  <div
                    className="category-item"
                    onClick={() =>
                      navigate(`/products?category=${category.name}`)
                    }
                    style={{ backgroundImage: `url(${category.urlImage})` }}
                  >
                    <h3 style={{ userSelect: "none" }}>{category.name}</h3>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
        <Row className="justify-content-md-center pb-3">
          <Col md="auto" style={{ fontSize: "24px", fontWeight: "bold" }}>
            THE HIGHLANDERS OF THE MOMENT
          </Col>
        </Row>
        <div className="product-grid">
          <Container>
            <Row className="mx-lg-5">
              {featuredProducts.map((featuredProduct) => {
                if (!featuredProduct.product) {
                  console.error(
                    "Product details are missing for featured product",
                    featuredProduct._id
                  );
                  return null;
                }
                return (
                  <Col
                    xs={12}
                    lg={4}
                    key={featuredProduct._id}
                    className="mb-3"
                  >
                    <ProductItem
                      product={featuredProduct.product}
                      stockQuantity={featuredProduct.quantity}
                    />
                  </Col>
                );
              })}
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
}
