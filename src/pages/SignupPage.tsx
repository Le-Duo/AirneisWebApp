import { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import { useUserSignupMutation } from '../hooks/userHook'
import { ApiError } from '../types/APIError'
import { getError } from '../utils'
import { toast } from 'react-toastify'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox'
import { useTranslation } from 'react-i18next'

export default function SignupPage() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectUrl ? redirectUrl : '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { state, dispatch } = useContext(Store)
  const { userInfo } = state

  const { t } = useTranslation()

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

  const { mutateAsync: signup } = useUserSignupMutation()

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error(t('Passwords do not match'))
      return
    }
    try {
      setIsLoading(true)
      const data = await signup({ name, email, password })
      dispatch({ type: 'USER_SIGNIN', payload: data })
      navigate(redirect)
    } catch (err) {
      toast.error(getError(err as ApiError))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container className="small-container">
      <Helmet>
        <title>{t('Sign Up')}</title>
      </Helmet>
      <h1>{t('Sign Up')}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>{t('Name')}</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>{t('Email')}</Form.Label>
          <Form.Control
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>{t('Password')}</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>{t('Confirm Password')}</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3">
          <Button
            type="submit"
            disabled={isLoading}
            style={{ borderRadius: '100px' }}
          >
            {t('Sign Up')}
          </Button>
          {isLoading && <LoadingBox />}
        </div>

        <div className="mb-3">
          {t('Already have an account?')}{' '}
          <Link to={`/signin?redirect=${redirect}`}>{t('Sign In')}</Link>
        </div>
      </Form>
    </Container>
  )
}
