import React, { useState, FormEvent } from 'react';
import { usePasswordResetMutation } from '../hooks/userHook';
import { Button, Form, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PasswordReset: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState<string>('');
  const { mutate, status, isError, isSuccess } = usePasswordResetMutation();
  const { t } = useTranslation();

  const isLoading = status === 'pending';

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (token) {
      mutate({ token, newPassword });
    } else {
      console.error(t('Token is undefined.'));
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="newPassword">
              <Form.Label>{t('New Password')}</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                aria-describedby="emailHelpBlock"
                disabled={isLoading}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading} className="w-100 mt-3">
              {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : t('Reset Password')}
            </Button>
            {isError && <Alert variant="danger">{t('Failed to reset password. Please try again.')}</Alert>}
            {isSuccess && <Alert variant="success">{t('Password reset successful.')}</Alert>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordReset;
