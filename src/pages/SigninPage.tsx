import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { Store } from '../Store'
import { useUserSigninMutation } from '../hooks/userHook'
import { ApiError } from '../types/APIError'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox'
import { useTranslation } from 'react-i18next'

export default function SigninPage() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl ? redirectInUrl : '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { state, dispatch } = useContext(Store)
  const { userInfo } = state

  const { mutateAsync: signin } = useUserSigninMutation()
  const { t } = useTranslation()

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const data = await signin({ email, password })
      dispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate(redirect)
    } catch (err) {
      console.log(err)
      toast.error(getError(err as ApiError))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo])

  return (
    <Container className="small-container">
      <Helmet>
        <title>{t('Sign In')}</title>
      </Helmet>
      <h1 className="my-3">{t('Sign In')}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>{t('Email')}</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>{t('Password')}</Form.Label>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="show-password">
          <Form.Check
            type="checkbox"
            label={t('Show Password')}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
        </Form.Group>
        <div className="mb-3">
          <Link to="/password-reset-request">{t('Forgot Password?')}</Link>
        </div>
        <div className="mb-3">
          <Button
            type="submit"
            disabled={isLoading}
            style={{ borderRadius: '100px' }}
          >
            {t('Sign In')}
          </Button>
          {isLoading && <LoadingBox />}
        </div>
        <div className="mb-3">
          {t('New customer?')}{' '}
          <Link to={`/signup?redirect=${redirect}`}>
            {t('Create your account')}
          </Link>{' '}
        </div>
      </Form>
    </Container>
  )
}
