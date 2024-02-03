import React, { useState, FormEvent } from 'react'
import { usePasswordResetMutation } from '../hooks/userHook'
import { Button, Form, Alert } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

const PasswordReset: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const [newPassword, setNewPassword] = useState<string>('')
  const { mutate, status, isError, isSuccess } = usePasswordResetMutation()

  const isLoading = status === 'pending' // Adjusted to check the status correctly

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Token: ', token)
    console.log('New Password: ', newPassword)
    if (token) {
      mutate({ token, newPassword })
    } else {
      console.error('Token is undefined.')
    }
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
