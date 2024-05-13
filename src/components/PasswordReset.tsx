import React, { useState, FormEvent, useEffect, useCallback } from 'react';
import { usePasswordResetMutation } from '../hooks/userHook';
import { Button, Form, Alert, Spinner, Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordReset: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [passwordSuggestions, setPasswordSuggestions] = useState<string[]>([
    'Password must be at least 8 characters long.',
    'Password should include at least one letter.',
    'Password should include at least one number.',
    'Password should include at least one special character.'
  ]);
  const [formSubmissionMessage, setFormSubmissionMessage] = useState<string>('');
  const { mutate, isError } = usePasswordResetMutation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const validatePassword = useCallback((password: string): boolean => {
    const minLength = 8;
    const hasLetters = /[A-Za-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[^A-Za-z\d]/.test(password);
    const suggestions = [];

    if (password.length < minLength) {
      suggestions.push(t('Password must be at least 8 characters long.'));
    }
    if (!hasLetters) {
      suggestions.push(t('Password should include at least one letter.'));
    }
    if (!hasNumbers) {
      suggestions.push(t('Password should include at least one number.'));
    }
    if (!hasSpecialChars) {
      suggestions.push(t('Password should include at least one special character.'));
    }

    setPasswordSuggestions(suggestions);

    let strength = 0;
    strength += hasLetters ? 25 : 0;
    strength += hasNumbers ? 25 : 0;
    strength += hasSpecialChars ? 25 : 0;
    strength += password.length >= minLength ? 25 : 0;

    setPasswordStrength(strength);
    setPasswordError(strength === 100 ? '' : t('Please ensure your password meets all the requirements listed.'));
    return strength === 100;
  }, [t]);

  useEffect(() => {
    validatePassword(newPassword);
  }, [newPassword, validatePassword]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newPassword = e.target.value.replace(/\s/g, '');
    setNewPassword(newPassword);
    validatePassword(newPassword);
  };

  const submitForm = async (token: string, newPassword: string) => {
    setLoading(true);
    try {
      await mutate({ token, newPassword });
      setFormSubmissionMessage(t('Password reset successful. You will be redirected to the login page in a few seconds.'));
      setTimeout(() => navigate('/signin'), 3000);
    } catch (error: unknown) {
      setFormSubmissionMessage(t('Failed to reset password. Please check the token and try again, or contact support if the issue persists.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPassword) {
      setPasswordError(t('Please enter a password.'));
      return;
    }
    if (passwordError) {
      return;
    }
    if (token) {
      submitForm(token, newPassword);
    } else {
      console.error(t('Token is undefined. Please ensure you are using a valid reset link.'));
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card className="p-3 p-sm-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="newPassword">
                <Form.Label>{t('New Password')}</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handlePasswordChange}
                    required
                    aria-describedby="passwordHelpBlock passwordStrengthFeedback"
                    disabled={loading}
                    isInvalid={!!passwordError}
                    aria-invalid={!!passwordError}
                    onBlur={(e) => validatePassword(e.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? t("Hide password") : t("Show password")}
                    disabled={loading}
                    title={showPassword ? t("Hide password") : t("Show password")}
                    aria-controls="newPassword"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {passwordError}
                </Form.Control.Feedback>
                <Form.Text id="passwordStrengthFeedback" muted>
                  {t('Password Strength')}:
                </Form.Text>
                <ProgressBar now={passwordStrength} label={`${passwordStrength}%`} />
                <Form.Text id="passwordHelpBlock" muted>
                  {passwordSuggestions.map((suggestion, index) => (
                    <div key={index}>{suggestion}</div>
                  ))}
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit" disabled={loading || !newPassword.trim()} className="w-100 mt-3 btn-lg">
                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : t('Reset Password')}
              </Button>
              <div className="mt-3 text-center">
                <Link to="/signin" aria-label={t("Back to Sign In")}>{t('Back to Sign In')}</Link>
              </div>
              {formSubmissionMessage && (
                <Alert variant={isError ? "danger" : "success"} className="mt-3">
                  {formSubmissionMessage}
                  {isError && <div><Link to="/contact">{t('Contact Support')}</Link></div>}
                </Alert>
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordReset;
