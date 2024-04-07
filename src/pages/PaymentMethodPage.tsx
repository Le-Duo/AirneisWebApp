import { useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import { useContext, useEffect, useState } from 'react'
import CheckoutSteps from '../components/CheckoutSteps'
import { Helmet } from 'react-helmet-async'
import { Button, Form } from 'react-bootstrap'

export default function PaymentMethodPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { shippingAddress, paymentMethod },
  } = state
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'Card'
  )
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping')
    }
  }, [shippingAddress, navigate])

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault()
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName })
    localStorage.setItem('paymentMethod', paymentMethodName)
    navigate('/placeorder')
  }
  return (
    <div>
      <CheckoutSteps step1 step2 step3  step4={false}></CheckoutSteps>
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="card"
              name="paymentMethod"
              value="Card"
              label="Card"
              checked={paymentMethodName === 'Card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="paypal"
              name="paymentMethod"
              value="PayPal"
              label="PayPal"
              checked={paymentMethodName === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit" style={{ borderRadius: '100px' }}>
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
