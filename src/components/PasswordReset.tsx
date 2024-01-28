import React, { useState, FormEvent } from 'react'
import { usePasswordResetMutation } from '../hooks/userHook'
import { Button, Form, Alert } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

interface PasswordResetProps {
  token: string
}

const PasswordReset: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const [newPassword, setNewPassword] = useState<string>('')
  const { mutate, isLoading, isError, isSuccess } = usePasswordResetMutation()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Token: ', token)
    console.log('New Password: ', newPassword)
    mutate({ token, newPassword })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="newPassword">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={isLoading}>
        Reset Password
      </Button>
      {isError && (
        <Alert variant="danger">
          Failed to reset password. Please try again.
        </Alert>
      )}
      {isSuccess && <Alert variant="success">Password reset successful.</Alert>}
    </Form>
  )
}

export default PasswordReset
