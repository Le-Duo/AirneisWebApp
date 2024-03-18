import { useContext } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import { Store } from '../Store'
import useCarousel from '../hooks/carouselHook'

const HomeCarousel = () => {
  const { state } = useContext(Store)
  const { mode } = state
  const { items, loading, error } = useCarousel()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  // Ensure items is always treated as an array
  const carouselItems = Array.isArray(items) ? items : []

  if (carouselItems.length === 0) {
    return <div>No images available</div>
  }

  return (
    <Carousel>
      {carouselItems.map((item, index) => (
        <Carousel.Item key={index}>
          <img className="d-block w-100" src={item.src} alt={item.alt} />
          <Carousel.Caption className={mode === 'dark' ? 'dark-mode' : ''}>
            <h3 style={{ textShadow: '1px 1px 2px black' }}>{item.caption}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default HomeCarousel
