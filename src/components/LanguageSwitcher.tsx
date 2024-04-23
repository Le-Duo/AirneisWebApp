import { useTranslation } from 'react-i18next';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { Store } from '../Store';

interface LanguageInfo {
  name: string;
  flag: string;
}

const languages: Record<string, LanguageInfo> = {
  // en: { name: 'English', flag: 'https://flagcdn.com/256x192/us.png' },
  fr: { name: 'Français', flag: 'https://flagcdn.com/256x192/fr.png' },
  // ar: { name: 'العربية', flag: 'https://flagcdn.com/256x192/sa.png' },
  // he: { name: 'עברית', flag: 'https://flagcdn.com/256x192/il.png' },
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const { state } = useContext(Store); // Use the Store context to access the state
  const { mode } = state; // Destructure to get mode from state

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    setShowModal(false);
  };

  return (
    <>
      <Button variant={mode} onClick={() => setShowModal(true)} className="ms-2 justify-content-center">
        {languages[i18n.language]?.flag && (
          <img src={languages[i18n.language].flag} alt={i18n.language} style={{ width: 20, verticalAlign: 'middle' }} />
        )}
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Choose Language</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              {Object.keys(languages).map((lang) => (
                <Col xs={12} md={4} key={lang} className="text-center">
                <Button variant="link" onClick={() => changeLanguage(lang)} style={{ display: 'block', width: '100%', textAlign: 'center', padding: '10px', textDecoration: 'none' }}>
                  <img src={languages[lang].flag} alt={lang} style={{ width: 60, height: 'auto', marginRight: 'auto', marginLeft: 'auto', display: 'block', verticalAlign: 'middle' }} />
                  {languages[lang].name}
                </Button>
              </Col>
              ))}
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LanguageSwitcher;
