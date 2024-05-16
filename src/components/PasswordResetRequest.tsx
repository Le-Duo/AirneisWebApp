import { useState, useEffect } from 'react';
import { usePasswordResetRequestMutation } from '../hooks/userHook';
import { Button, Form, Alert, Spinner, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const { mutate, isError } = usePasswordResetRequestMutation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (email) {
      if (!validateEmail(email)) {
        setEmailError(t('Please enter a valid email address.'));
      } else {
        setEmailError('');
      }
    }
  }, [email, t]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
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
    setFeedbackMessage(t('Processing your request...'));
    mutate(email, {
      onSuccess: () => {
        setLoading(false);
        setFeedbackMessage(t('Reset link has been sent to your email. You will be redirected to the sign-in page shortly.'));
        setTimeout(() => navigate('/signin'), 5000);
      },
      onError: (error: Error) => {
        setLoading(false);
        let userFriendlyError = '';
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          switch (axiosError.response.status) {
            case 404:
              userFriendlyError = t('No account found with that email. Please try again.');
              break;
            default:
              userFriendlyError = t('Failed to send reset link. Please check your network connection and try again.');
              break;
          }
        } else {
          userFriendlyError = t('An unexpected error occurred. Please try again later.');
        }
        setFeedbackMessage(userFriendlyError);
      },
    });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className="p-3 p-sm-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label>{t('Email')}</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  aria-describedby="emailHelpBlock"
                  aria-invalid={!!emailError}
                  disabled={loading}
                  isInvalid={!!emailError}
                />
                <Form.Control.Feedback type="invalid">
                  {emailError}
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3 btn-lg">
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  t('Send Reset Link')
                )}
              </Button>
              <div className="mt-3 text-center">
                <Link to="/signin">{t('Back to Sign In')}</Link>
              </div>
              {feedbackMessage && (
                <Alert variant={isError ? "danger" : "success"} className="mt-3">
                  {feedbackMessage}
                </Alert>
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordResetRequest;
