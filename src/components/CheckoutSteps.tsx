import { Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

export default function CheckoutSteps(props: {
  step1: boolean
  step2: boolean
  step3: boolean
  step4: boolean
}) {
  const { t } = useTranslation();

  return (
    <Row className="row checkout-steps">
      <Col className={props.step1 ? 'active' : ''}>{t('Sign-In')}</Col>
      <Col className={props.step2 ? 'active' : ''}>{t('Shipping')}</Col>
      <Col className={props.step3 ? 'active' : ''}>{t('Payment')}</Col>
      <Col className={props.step4 ? 'active' : ''}>{t('Place Order')}</Col>
    </Row>
  )
}
