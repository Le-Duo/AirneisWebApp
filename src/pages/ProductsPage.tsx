import { Row, Col, Pagination } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ProductItem from '../components/ProductItem';
import { useSearchProducts } from '../hooks/searchHook';
import { useGetCategoryDetailsBySlugQuery } from '../hooks/categoryHook';
import { getError } from '../utils';
import { ApiError } from '../types/APIError';
import { Product } from '../types/Product';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function ProductsPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categorySlug = queryParams.get('category');
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: categoryDetails,
    isLoading: isLoadingCategoryDetails,
    error: errorCategoryDetails,
  } = useGetCategoryDetailsBySlugQuery(categorySlug || '');
  const {
    data: productsData,
    error,
    isLoading,
  } = useSearchProducts({
    categories: categorySlug ? [categorySlug] : undefined,
    page: currentPage,
    limit: 10,
  });

  if (isLoading || isLoadingCategoryDetails) {
    return <LoadingBox />;
  }

  if (error || errorCategoryDetails) {
    return <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>;
  }

  if (!productsData) {
    return <LoadingBox />;
  }

  const totalPages = Math.ceil(productsData.totalResults / 10);
  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
        {number}
      </Pagination.Item>,
    );
  }

  return (
    <div>
      <Helmet>
        <title>{categoryDetails?.name ? t(categoryDetails.name) : t('Products')}</title>
      </Helmet>
      {categoryDetails?.urlImage && (
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <img src={categoryDetails.urlImage} alt={t(categoryDetails.name)} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              textShadow: '0px 0px 8px black',
            }}
          >
            <h2 style={{ fontSize: '2.5rem' }}>{t(categoryDetails.name)}</h2>
          </div>
        </div>
      )}
      <Row className="justify-content-md-center" style={{ marginBottom: '20px' }}>
        <Col>
          <p style={{ fontSize: '1.2rem', textAlign: 'center' }}>{t(categoryDetails?.description || '')}</p>
        </Col>
      </Row>
      <Row>
        {productsData?.results.map((product: Product) => (
          <Col xs={12} md={4} key={product.slug} className="mb-4">
            <ProductItem product={product} stockQuantity={product.quantity} />
          </Col>
        ))}
      </Row>
      <Pagination>{items}</Pagination>
    </div>
  );
}
