import { useGetCategoriesQuery } from '../hooks/categoryHook'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import HomeCarousel from '../components/HomeCarousel'
import CookieConsent from '../components/CookieConsent'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Container, Row, Col } from 'react-bootstrap'

export default function HomePage() {
  const navigate = useNavigate()
  const { data: categories, isLoading, error } = useGetCategoriesQuery()

  if (isLoading) return <LoadingBox />
  if (error) return <MessageBox variant='danger'>Error loading categories</MessageBox>
  if (!Array.isArray(categories))
    return <MessageBox variant='warning'>Categories data is not valid</MessageBox>

  return (
    <>
      <CookieConsent />
      <Helmet>
        <title>Home | Airneis</title>
      </Helmet>
      <div className='home-page'>
        <HomeCarousel />
        <Container>
          <Row className='justify-content-md-center pt-3'>
            <Col md='auto' style={{ fontSize: '24px', fontWeight: 'bold' }}>
              FROM THE HIGHLANDS OF SCOTLAND
            </Col>
          </Row>
          <Row className='justify-content-md-center pb-3'>
            <Col md='auto' style={{ fontSize: '24px', fontWeight: 'bold' }}>
              OUR FURNITURE IS IMMORTAL
            </Col>
          </Row>
        </Container>
        <div className='category-grid'>
          <Container>
            <Row>
              {categories.map(category => (
                <Col
                  xs={12}
                  lg={4}
                  key={category._id}
                  className='d-flex justify-content-center mb-3'
                >
                  <div
                    className='category-item'
                    onClick={() => navigate(`/products?category=${category.name}`)}
                    style={{ backgroundImage: `url(${category.urlImage})` }}
                  >
                    <h3 style={{ userSelect: 'none' }}>{category.name}</h3>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
        <Row className='justify-content-md-center pb-3'>
          <Col md='auto' style={{ fontSize: '24px', fontWeight: 'bold' }}>
            THE HIGHLANDERS OF THE MOMENT
          </Col>
        </Row>
        <div className='product-grid'></div>
      </div>
    </>
  )
}
