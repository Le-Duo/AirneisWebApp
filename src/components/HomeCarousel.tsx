import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Carousel from 'react-bootstrap/Carousel';
import { Placeholder } from 'react-bootstrap';
import { Store } from '../Store';
import { useGetCarouselItemsQuery } from '../hooks/carouselHook';

const HomeCarousel = () => {
  const { t } = useTranslation();
  const { state: { mode } } = useContext(Store);
  const { data: items, isLoading, error } = useGetCarouselItemsQuery();

  if (isLoading) return (
    <div style={{ width: '100%', minHeight: '40dvh', height: '40dvh' }}>
      <Placeholder as="div" animation="glow" style={{ height: '100%', width: '100%' }}>
        <Placeholder xs={12} style={{ height: '100%', width: '100%' }} />
      </Placeholder>
    </div>
  );
  if (error) return <div>{t('Error')}: {error.message}</div>;

  const carouselItems = Array.isArray(items) ? items : []

  if (carouselItems.length === 0) {
    return <div>{t('No images available')}</div>
  }

  return (
    <Carousel>
      {items?.map((item, index) => (
        <Carousel.Item key={item._id || index}>
          <img className='d-block w-100' src={item.src} alt={item.alt} loading="lazy" />
          <Carousel.Caption className={mode === 'dark' ? 'dark-mode' : ''}>
            <h3 style={{ textShadow: '0px 0px 10px black' }}>{t(item.caption)}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HomeCarousel;