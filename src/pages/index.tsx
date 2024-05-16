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
import { Product } from "../types/Product";
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();
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
    return <MessageBox variant="danger">{t('errorLoadingCategories')}</MessageBox>;
  if (errorFeaturedProducts)
    return (
      <MessageBox variant="danger">{t('errorLoadingFeaturedProducts')}</MessageBox>
    );
  if (!Array.isArray(categories))
    return (
      <MessageBox variant="warning">{t('Categories data is not valid')}</MessageBox>
    );
  if (!Array.isArray(featuredProducts))
    return (
      <MessageBox variant="warning">
        {t('Featured products data is not valid')}
      </MessageBox>
    );

  return (
    <>
      <CookieConsent />
      <Helmet>
        <title>{t('Home')} | Àirneis</title>
      </Helmet>
      <div className="home-page">
        <HomeCarousel />
        <Container>
          <Row className="justify-content-md-center pt-3">
            <Col md="auto" style={{ fontSize: "24px", fontWeight: "bold" }}>
              {t('FROM THE HIGHLANDS OF SCOTLAND')}
            </Col>
          </Row>
          <Row className="justify-content-md-center pb-3">
            <Col md="auto" style={{ fontSize: "24px", fontWeight: "bold" }}>
              {t('OUR FURNITURE IS IMMORTAL')}
            </Col>
          </Row>
        </Container>
        <div className="category-grid">
          <Container>
            <Row>
              {categories.map((category) => (
                <Col
                  xs={12}
                  md={4}
                  key={category._id}
                  className="d-flex justify-content-center mb-3"
                >
                  <div
                    className="category-item"
                    onClick={() =>
                      navigate(`/products?category=${category.slug}`)
                    }
                    style={{ backgroundImage: `url(${category.urlImage})` }}
                  >
                    <h3 style={{ userSelect: "none" }}>{t(category.name)}</h3>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
        <Row className="justify-content-md-center pb-3">
          <Col md="auto" style={{ fontSize: "24px", fontWeight: "bold" }}>
            {t('THE HIGHLANDERS OF THE MOMENT')}
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
                    md={4}
                    key={featuredProduct._id}
                    className="mb-3"
                  >
                    <ProductItem
                      product={featuredProduct.product as Product}
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
