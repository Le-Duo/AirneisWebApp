import { Container } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next';

const TOSPage = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Helmet>
        <title>{t('Terms of Use')}</title>
      </Helmet>
      <h1>{t('Terms of Use')}</h1>
      <p>{t('By using our site, you agree to the following terms of use:')}</p>
      <ul>
        <li>{t('You must not use our site in an illegal or malicious manner.')}</li>
        <li>{t('You must not attempt to gain unauthorized access to our site.')}</li>
        <li>
          {t('You must not use our site to transmit viruses or other malicious software.')}
        </li>
        <li>{t('You must not use our site to harass, insult, or harm others.')}</li>
      </ul>
    </Container>
  )
}

export default TOSPage
