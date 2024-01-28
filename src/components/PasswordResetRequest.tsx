import React, { useState } from 'react'
import { usePasswordResetRequestMutation } from '../hooks/userHook'
import { Button, Form, Alert } from 'react-bootstrap'

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('')
  const { mutate, isLoading, isError, isSuccess, error } =
    usePasswordResetRequestMutation()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('handleSubmit called with email:', email)
    mutate(email)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={isLoading}>
        Send Reset Link
      </Button>
      {isError && (
        <Alert variant="danger">
          Failed to send reset link. Please try again.
        </Alert>
      )}
      {isSuccess && (
        <Alert variant="success">Check your email for the reset link.</Alert>
      )}
      {error && <Alert variant="danger">{error.message}</Alert>}
    </Form>
  )
}

export default PasswordResetRequest
