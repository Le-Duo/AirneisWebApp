import { useState, useEffect } from 'react';
import { Button, Container, Form, Row, Col, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useGetUserByIdQuery, useUpdateDefaultCardMutation, useAddPaymentCardMutation } from '../hooks/userHook';
import { CreditCard } from './../types/CreditCard';
import { useTranslation } from 'react-i18next';

export default function MyWalletPage() {
  const { t } = useTranslation();
  const userConnectedID = JSON.parse(localStorage.getItem('userInfo')!)._id;
  const { data: user, error, isLoading } = useGetUserByIdQuery(userConnectedID);

  const [cards, setCards] = useState<CreditCard[]>([]);
  const { mutateAsync: updateDefaultCard } = useUpdateDefaultCardMutation(userConnectedID);
  const { mutateAsync: addCard } = useAddPaymentCardMutation(userConnectedID);

  const [formData, setFormData] = useState({
    bankName: '',
    number: '',
    fullName: '',
    monthExpiration: '',
    yearExpiration: '',
  });

  const [formErrors, setFormErrors] = useState({
    bankName: '',
    number: '',
    fullName: '',
    monthExpiration: '',
    yearExpiration: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      formattedValue = value.replace(/\D/g, '');
      formattedValue = formattedValue.substring(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }));

    validateField(name, formattedValue);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'bankName':
        if (!value.trim() || value.length < 2 || value.length > 40) {
          error = t('Bank name must be between 2 and 40 characters.');
        }
        break;
      case 'number':
        if (!/^\d{16}$/.test(value.replace(/\s/g, '')) || value.length !== 19) {
          error = t('Card number must be exactly 16 digits.');
        }
        break;
      case 'fullName':
        if (!value.trim() || !/^[a-zA-Z\s]*$/.test(value)) {
          error = t('Full name must contain only letters and spaces.');
        }
        break;
      case 'monthExpiration': {
        const month = parseInt(value);
        if (isNaN(month) || month < 1 || month > 12) {
          error = t('Month must be between 01 and 12.');
        }
        break;
      }
      case 'yearExpiration': {
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < currentYear || year > currentYear + 10) {
          error = t(`Year must be between ${currentYear} and ${currentYear + 10}.`);
        }
        break;
      }
      default:
        break;
    }
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const validateForm = () => {
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key as keyof typeof formData]);
    });
    return Object.values(formErrors).every((error) => error === '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const newCardData = {
      bankName: formData.bankName,
      number: formData.number.replace(/\s/g, ''),
      fullName: formData.fullName,
      monthExpiration: parseInt(formData.monthExpiration),
      yearExpiration: parseInt(formData.yearExpiration),
    };

    await addCard(newCardData);

    setFormData({
      bankName: '',
      number: '',
      fullName: '',
      monthExpiration: '',
      yearExpiration: '',
    });

    alert(t('Card added successfully!'));
    window.location.reload();
  };

  const CreditCardHTML = ({ _id, bankName, number, fullName, monthExpiration, yearExpiration, isDefault }: CreditCard) => {
    return (
      <Card className="credit-card" onClick={() => handleCardClick(_id)}>
        {isDefault && <Card.Header className="default-badge">{t('Default')}</Card.Header>}
        <Card.Body>
          <Card.Title className="bank-name">{bankName}</Card.Title>
          <Card.Text className="card-number">{number}</Card.Text>
          <div className="card-holder">
            <div className="label">{t('Card Holder')}</div>
            <div className="name">{fullName}</div>
          </div>
          <div className="expiration">
            <div className="label">{t('Expires')}</div>
            <div className="date">
              {monthExpiration}/{yearExpiration}
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  useEffect(() => {
    if (user && user.paymentCards) {
      setCards(user.paymentCards);
    }
  }, [user]);

  if (isLoading) return <div>{t('Loading...')}</div>;
  if (error) return <div>{t('Error fetching one user')}</div>;

  const handleCardClick = (cardId: string) => {
    updateDefaultCard(cardId);
    window.location.reload();
  };

  return (
    <Container className="medium-container">
      <Helmet>
        <title>{t('Wallet')}</title>
      </Helmet>
      <h1 className="my-3">{t('Wallet')}</h1>

      <Container>
        <h3 className="mt-5">{t('List of Payment Cards')}:</h3>
        <Row>
          {cards.map((card) => (
            <Col key={card._id} md={6} className="mb-4">
              <CreditCardHTML {...card} />
            </Col>
          ))}
        </Row>
      </Container>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="bankName">
          <Form.Label>{t('Bank Name')}</Form.Label>
          <Form.Control
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            isInvalid={!!formErrors.bankName}
            maxLength={40}
          />
          <Form.Control.Feedback type="invalid">{formErrors.bankName}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="number">
          <Form.Label>{t('Card Number')}</Form.Label>
          <Form.Control
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            isInvalid={!!formErrors.number}
            maxLength={19}
          />
          <Form.Control.Feedback type="invalid">{formErrors.number}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="fullName">
          <Form.Label>{t('Full Name')}</Form.Label>
          <Form.Control
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            isInvalid={!!formErrors.fullName}
            maxLength={50}
          />
          <Form.Control.Feedback type="invalid">{formErrors.fullName}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="expiration">
          <Form.Label>{t('Expiration Date')}</Form.Label>
          <div className="d-flex">
            <Form.Control
              type="text"
              placeholder="MM"
              name="monthExpiration"
              value={formData.monthExpiration}
              onChange={handleChange}
              isInvalid={!!formErrors.monthExpiration}
              maxLength={2}
            />
            <span className="mx-2">/</span>
            <Form.Control
              type="text"
              placeholder="YYYY"
              name="yearExpiration"
              value={formData.yearExpiration}
              onChange={handleChange}
              isInvalid={!!formErrors.yearExpiration}
              maxLength={4}
            />
            <Form.Control.Feedback type="invalid">{formErrors.monthExpiration || formErrors.yearExpiration}</Form.Control.Feedback>
          </div>
        </Form.Group>

        <Button variant="primary" type="submit">
          {t('Add Card')}
        </Button>
      </Form>
    </Container>
  );
}
