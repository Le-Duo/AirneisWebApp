import { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const consent = sessionStorage.getItem('cookieConsent');
    if (consent !== 'true') {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    sessionStorage.setItem('cookieConsent', 'true');
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <Alert variant="primary" className="text-center" style={{ position: 'fixed', bottom: 20, left: 20, right: 20, margin: 'auto', width: 'auto', maxWidth: '1000px', zIndex: 1000 }}>
      {t('We use functional cookies to ensure the best experience on our website.')}
      <Button variant="primary" size="sm" onClick={handleAccept} style={{ marginLeft: '10px' }}>
        {t('OK')}
      </Button>
    </Alert>
  );
};

export default CookieConsent;