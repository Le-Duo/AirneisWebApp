import { useContext } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import { Store } from '../Store'
import { useGetCarouselItemsQuery } from '../hooks/carouselHook'

const HomeCarousel = () => {
  const { state } = useContext(Store)
  const { mode } = state
  const { data: items, isLoading: loading, error } = useGetCarouselItemsQuery()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div> // Convert error to string

  // Ensure items is always treated as an array
  const carouselItems = Array.isArray(items) ? items : []

  console.log(carouselItems) // Log the carousel items
  if (carouselItems.length === 0) {
    return <div>No images available</div>
  }

  return (
    <Carousel>
      {carouselItems.map((item, index) => (
        <Carousel.Item key={index}>
          <img className='d-block w-100' src={item.src} alt={item.alt} />
          <Carousel.Caption className={mode === 'dark' ? 'dark-mode' : ''}>
            <h3 style={{ textShadow: '0px 0px 10px black' }}>{item.caption}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default HomeCarousel
