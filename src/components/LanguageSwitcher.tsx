import { useTranslation } from 'react-i18next';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { Store } from '../Store';

interface LanguageInfo {
  name: string;
  flag: string;
}

const languages: Record<string, LanguageInfo> = {
  en: { name: 'English', flag: 'https://flagcdn.com/256x192/gb.png' },
  cn: { name: '汉语', flag: 'https://flagcdn.com/256x192/cn.png' },
  hi: { name: 'हिन्दी', flag: 'https://flagcdn.com/256x192/in.png' },
  es: { name: 'Español', flag: 'https://flagcdn.com/256x192/es.png' },
  fr: { name: 'Français', flag: 'https://flagcdn.com/256x192/fr.png' },
  ar: { name: 'العربية', flag: 'https://flagcdn.com/256x192/sa.png' },
  ru: { name: 'Русский', flag: 'https://flagcdn.com/256x192/ru.png' },
  pt: { name: 'Português', flag: 'https://flagcdn.com/256x192/pt.png' },
  id: { name: 'Bahasa Indonesia', flag: 'https://flagcdn.com/256x192/id.png' },
  de: { name: 'Deutsch', flag: 'https://flagcdn.com/256x192/de.png' },
  ja: { name: '日本語', flag: 'https://flagcdn.com/256x192/jp.png' },
  tr: { name: 'Türkçe', flag: 'https://flagcdn.com/256x192/tr.png' },
  vn: { name: 'Tiếng Việt', flag: 'https://flagcdn.com/256x192/vn.png' },
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const { state } = useContext(Store);
  const { mode } = state;

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    setShowModal(false);
  };

  const currentLanguageInfo = languages[i18n.language];

  return (
    <>
      <Button variant={mode} onClick={() => setShowModal(true)} className="ms-2 justify-content-center">
        {currentLanguageInfo && currentLanguageInfo.flag && (
          <img src={currentLanguageInfo.flag} alt={i18n.language} style={{ width: 20, verticalAlign: 'middle' }} />
        )}
      </Button>

      <Modal scrollable show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              {Object.entries(languages).map(([lang, info]) => (
                <Col xs={12} md={4} key={lang} className="text-center">
                  <Button
                    variant="link"
                    onClick={() => changeLanguage(lang)}
                    style={{ display: 'block', width: '100%', textAlign: 'center', padding: '10px', textDecoration: 'none' }}
                  >
                    <img
                      src={info.flag}
                      alt={lang}
                      style={{ width: 60, height: 'auto', marginRight: 'auto', marginLeft: 'auto', display: 'block', verticalAlign: 'middle' }}
                    />
                    {info.name}
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
