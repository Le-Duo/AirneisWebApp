import { useContext } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import { Store } from '../Store'

const HomeCarousel = () => {
  const { state } = useContext(Store)
  const { mode } = state

  // Les données du carrousel seront récupérées et gérées ici
  // Pour l'instant, nous utilisons des données factices pour le placeholder
  const carouselItems = [
    {
      src: '../../public/images/livingroom.png',
      alt: 'Salon',
      caption: 'Salon',
    },
    {
      src: '../../public/images/bedroom.png',
      alt: 'Chambre',
      caption: 'Chambre',
    },
    {
      src: '../../public/images/garden.png',
      alt: 'Extérieur',
      caption: 'Extérieur',
    },
  ]

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
