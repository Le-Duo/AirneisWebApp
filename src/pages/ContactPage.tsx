import { useState, useRef  } from 'react'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import { ApiError } from '../types/APIError'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox'
import { useCreateContactMutation } from '../hooks/contactHook'
import { useTranslation } from 'react-i18next';

export default function ContactPage() {
  const { t } = useTranslation();
  const [mail, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const { mutateAsync: createContact } = useCreateContactMutation()
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null);

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      await createContact({
        mail: mail,
        subject: subject,
        message: message,
      })

      toast.success(t("New message sent"))

      if (formRef.current) {
        formRef.current.reset();
      }

    } catch (err) {
      console.log(err)
      toast.error(getError(err as ApiError))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container className="small-container">
      <Helmet>
        <title>{t('Contact')}</title>
      </Helmet>
      <h1 className="my-3">{t('Contact')}</h1>
      <Form onSubmit={submitHandler} ref={formRef}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>{t('Email')}</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="subject">
          <Form.Label>{t('Subject')}</Form.Label>
          <Form.Control
            type="input"
            required
            onChange={(e) => setSubject(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="message">
          <Form.Label>{t('Message')}</Form.Label>
          <Form.Control
            as="textarea"
            required
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button
            type="submit"
            disabled={isLoading}
            style={{ borderRadius: '100px' }}
          >
            {t('Send')}
          </Button>
          {isLoading && <LoadingBox />}
        </div>
      </Form>
    </Container>
  )
}