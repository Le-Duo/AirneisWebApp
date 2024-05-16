import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const LegalNoticePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('Legal Notice')} | Àirneis</title>
      </Helmet>
      <div>
        <h1>{t('Legal Notice')}</h1>
        <p>{t('Company Name')}: Àirneis Furniture Co.</p>
        <p>{t('Address')}: 123 High Street, Edinburgh, EH1 1RE, Scotland</p>
        <p>{t('Contact')}: contact@airneis.com | +44 131 555 5555</p>
        <p>{t('Company Registration Number')}: SC123456</p>
        <p>{t('Publication Director')}: Ewan McGregor</p>
        <p>
          {t('Hosting Provider')}: Àirneis Hosting, 789 Web Services Avenue, Edinburgh,
          EH1 1RE, Scotland
        </p>
      </div>
    </>
  );
};

export default LegalNoticePage;
