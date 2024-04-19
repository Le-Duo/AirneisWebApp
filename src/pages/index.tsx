import { useGetCategoriesQuery } from '../hooks/categoryHook';
import { useGetFeaturedProductsQuery } from '../hooks/featuredProductHook';
import MessageBox from '../components/MessageBox';
import HomeCarousel from '../components/HomeCarousel';
import CookieConsent from '../components/CookieConsent';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container, Row, Col, Placeholder } from 'react-bootstrap';
import ProductItem from '../components/ProductItem';
import { Product } from '../types/Product';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: categories, isLoading: isLoadingCategories, error: errorCategories } = useGetCategoriesQuery();
  const { data: featuredProducts, isLoading: isLoadingFeaturedProducts, error: errorFeaturedProducts } = useGetFeaturedProductsQuery();

  return (
    <>
      <CookieConsent />
      <Helmet>
        <title>Home | Airneis</title>
      </Helmet>
      <div className="home-page">
        <HomeCarousel />
        {isLoadingCategories || isLoadingFeaturedProducts ? (
          <>
            <Container>
              <Placeholder as="p" animation="glow" className="text-center pt-3">
                <Placeholder xs={4} style={{ fontSize: '24px', fontWeight: 'bold' }} />
              </Placeholder>
              <Placeholder as="p" animation="glow" className="text-center pb-3">
                <Placeholder xs={4} style={{ fontSize: '24px', fontWeight: 'bold' }} />
              </Placeholder>
            </Container>
            <div className="category-grid">
              <Container>
                <Row>
                  {[...Array(6)].map((_, index) => (
                    <Col key={index} xs={12} md={4} className="d-flex justify-content-center mb-3">
                      <Placeholder as="div" animation="glow" className="category-item">
                        <Placeholder.Button variant="secondary" xs={12} style={{ height: '30dvh' }} />
                      </Placeholder>
                    </Col>
                  ))}
                </Row>
              </Container>
            </div>
            <Placeholder as="p" animation="glow" className="text-center pb-3">
              <Placeholder xs={4} style={{ fontSize: '24px', fontWeight: 'bold' }} />
            </Placeholder>
            <div className="product-grid">
              <Container>
                <Row className="mx-lg-5">
                  {[...Array(6)].map(
                    (
                      _,
                      index,
                    ) => (
                      <Col xs={12} md={4} key={index} className="mb-3">
                        <Placeholder as="div" animation="glow" className="product-item">
                          <Placeholder.Button variant="secondary" xs={12} style={{ height: '20vh' }} />
                        </Placeholder>
                      </Col>
                    ),
                  )}
                </Row>
              </Container>
            </div>
          </>
        ) : isLoadingFeaturedProducts || isLoadingCategories ? (
          <MessageBox variant="danger">Data is still loading</MessageBox>
        ) : errorCategories ? (
          <MessageBox variant="danger">Error loading categories</MessageBox>
        ) : errorFeaturedProducts ? (
          <MessageBox variant="danger">Error loading featured products</MessageBox>
        ) : !Array.isArray(categories) ? (
          <MessageBox variant="warning">Categories data is not valid</MessageBox>
        ) : !Array.isArray(featuredProducts) ? (
          <MessageBox variant="warning">Featured products data is not valid</MessageBox>
        ) : (
          <>
            <Container>
              <Row className="justify-content-md-center pt-3">
                <Col md="auto" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  FROM THE HIGHLANDS OF SCOTLAND
                </Col>
              </Row>
              <Row className="justify-content-md-center pb-3">
                <Col md="auto" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  OUR FURNITURE IS IMMORTAL
                </Col>
              </Row>
            </Container>
            <div className="category-grid">
              <Container>
                <Row>
                  {categories.map((category) => (
                    <Col xs={12} md={4} key={category._id} className="d-flex justify-content-center mb-3">
                      <div
                        className="category-item"
                        onClick={() => navigate(`/products?category=${category.slug}`)}
                        style={{ backgroundImage: `url(${category.urlImage})` }}
                      >
                        <h3 style={{ userSelect: 'none' }}>{category.name}</h3>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Container>
            </div>
            <Row className="justify-content-md-center pb-3">
              <Col md="auto" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                THE HIGHLANDERS OF THE MOMENT
              </Col>
            </Row>
            <div className="product-grid">
              <Container>
                <Row className="mx-lg-5">
                  {featuredProducts.map((featuredProduct) => {
                    if (!featuredProduct.product) {
                      console.error('Product details are missing for featured product', featuredProduct._id);
                      return null;
                    }
                    return (
                      <Col xs={12} md={4} key={featuredProduct._id} className="mb-3">
                        <ProductItem product={featuredProduct.product as Product} stockQuantity={featuredProduct.quantity} />
                      </Col>
                    );
                  })}
                </Row>
              </Container>
            </div>
          </>
        )}
      </div>
    </>
  );
}
