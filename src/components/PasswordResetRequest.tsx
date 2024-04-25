import { useState } from 'react';
import { usePasswordResetRequestMutation } from '../hooks/userHook';
import { Button, Form, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { mutate, isError, isSuccess, error } = usePasswordResetRequestMutation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!newEmail) {
      setEmailError(t('Email address is required.'));
    } else if (!validateEmail(newEmail)) {
      setEmailError(t('Please enter a valid email address.'));
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!email) {
      setEmailError(t('Email address is required.'));
      return;
    }
    if (!validateEmail(email)) {
      setEmailError(t('Please enter a valid email address.'));
      return;
    }
    setLoading(true);
    mutate(email, {
      onSuccess: () => {
        setLoading(false);
        navigate('/signin');
      },
      onError: () => {
        setLoading(false);
        setEmailError(t('An error occurred while sending the reset link. Please try again.'));
      },
    });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>{t('Email')}</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                aria-describedby="emailHelpBlock"
                disabled={loading}
                isInvalid={!!emailError}
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3">
              {loading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                t('Send Reset Link')
              )}
            </Button>
            {isError && error && (
              <Alert variant="danger" className="mt-3">
                {t('Failed to send reset link: {{error}}. Please try again.', { error: error.message })}
              </Alert>
            )}
            {isSuccess && (
              <Alert variant="success" className="mt-3">
                {t('Check your email for the reset link. You will be redirected to the sign-in page shortly.')}
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordResetRequest;
