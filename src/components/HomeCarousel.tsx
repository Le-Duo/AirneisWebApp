import React, { useContext } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import { Store } from '../Store'

const HomeCarousel = () => {
  const { state } = useContext(Store)
  const { mode } = state

  // Les données du carrousel seront récupérées et gérées ici
  // Pour l'instant, nous utilisons des données factices pour le placeholder
  const carouselItems = [
    {
      src: 'https://i.postimg.cc/wjptd2bH/image-8-topaz-enhance-3-4x-exposure-color.png',
      alt: 'Salon',
      caption: 'Salon',
    },
    {
      src: 'https://i.postimg.cc/j5FKdqxP/image-4-topaz-enhance-3-4x-exposure-color.png',
      alt: 'Chambre',
      caption: 'Chambre',
    },
    {
      src: 'https://i.postimg.cc/yY9J5tjv/image-2-topaz-enhance-3-4x-exposure-color.png',
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
