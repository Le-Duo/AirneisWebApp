import { useState, useEffect } from 'react'
import { usePasswordResetRequestMutation } from '../hooks/userHook'
import { Button, Form, Alert, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const PasswordResetRequest = () => {
  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { mutate, isError, isSuccess, error } =
    usePasswordResetRequestMutation()
  const navigate = useNavigate()

  const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
    if (!validateEmail(e.target.value)) {
      setEmailError('Please enter a valid email address.')
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setLoading(true)
    mutate(email, {
      onSuccess: () => {
        setLoading(false)
      },
      onError: () => {
        setLoading(false)
      },
    })
  }

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate('/signin')
      }, 5000)
    }
  }, [isSuccess, navigate])

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="email">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
          aria-describedby="emailHelpBlock"
          disabled={loading}
        />
        <Form.Text id="emailHelpBlock" muted>
          {emailError}
        </Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        ) : (
          'Send Reset Link'
        )}
      </Button>
      {isError && error && (
        <Alert variant="danger">
          {`Failed to send reset link: ${error.message}. Please try again.`}
        </Alert>
      )}
      {isSuccess && (
        <Alert variant="success">
          Check your email for the reset link. You will be redirected to the
          sign-in page shortly.
        </Alert>
      )}
    </Form>
  )
}

export default PasswordResetRequest
