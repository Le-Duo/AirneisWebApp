import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { useContext, useEffect, useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import { Helmet } from "react-helmet-async";
import { Badge, Button, Card, Col, Form, Row } from "react-bootstrap";
import { useGetUserByIdQuery } from "../hooks/userHook";
import { CreditCard } from "../types/CreditCard";

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || "Card"
  );
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  // récupération de l'id du user connecté dans le localStorage
  const userConnectedID = JSON.parse(localStorage.getItem("userInfo")!)._id;

  // récupération d'un user avec toutes ses propriétées dans la BDD
  const { data: user, error, isLoading } = useGetUserByIdQuery(userConnectedID);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [defaultUserCard, setDefaultUserCard] = useState<CreditCard>();

  const [bankName, setBankName] = useState("");
  const [number, setCardNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [monthExpiration, setMonthExpiration] = useState(0);
  const [yearExpiration, setYearExpiration] = useState(0);

  useEffect(() => {
    if (user && user.paymentCards) {
      setCards(user.paymentCards);
    }
  });

  useEffect(() => {
    if (cards) {
      let defaultCard = cards.find((element) => {
        return element.isDefault === true;
      });

      if (defaultCard) {
        setDefaultUserCard(defaultCard);
      }
    }
  }, [cards]);

  useEffect(() => {
    if (defaultUserCard) {
      setBankName(defaultUserCard.bankName);
      setCardNumber(defaultUserCard.number);
      setFullName(defaultUserCard.fullName);
      setYearExpiration(defaultUserCard.yearExpiration);
      setMonthExpiration(defaultUserCard.monthExpiration);
    }
  }, [defaultUserCard]);

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethodName);
    navigate("/placeorder");
  };

  const handleCardClick = (card: CreditCard) => {
    setBankName(card.bankName);
    setCardNumber(card.number);
    setFullName(card.fullName);
    setYearExpiration(card.yearExpiration);
    setMonthExpiration(card.monthExpiration);
  };

  const CardCard = ({
    card,
    onClick,
  }: {
    card: CreditCard;
    onClick: () => void;
  }) => {
    return (
      <Card
        style={{ marginBottom: "1rem", cursor: "pointer" }}
        onClick={onClick}
      >
        <Card.Header>
          {card.bankName}

          {card.isDefault && (
            <Badge bg="success" className="ms-5">
              Default
            </Badge>
          )}
        </Card.Header>
        <Card.Body>
          <Card.Title>{card.number}</Card.Title>
          <Card.Title>{card.fullName}</Card.Title>

          <Card.Text>
            {card.monthExpiration}, {card.yearExpiration}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching one user</div>;

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4={false}></CheckoutSteps>
      <div className="container medium-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>

        <Row>
          <Col md={8}>
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control readOnly value={fullName} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bankName">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control readOnly value={bankName} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="number">
                <Form.Label>Card Number</Form.Label>
                <Form.Control readOnly value={number} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="yearExpiration">
                <Form.Label>Year Expiration</Form.Label>
                <Form.Control
                  readOnly
                  value={monthExpiration + "/" + yearExpiration}
                  required
                />
              </Form.Group>

              <Form.Group controlId="ccv" className="mb-3">
                <Form.Label>CCV</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  pattern="\d{3}"
                  maxLength={3}
                  minLength={3}
                  required
                />
              </Form.Group>
              <div className="mb-3">
                <Button type="submit" style={{ borderRadius: "100px" }}>
                  Continue
                </Button>
              </div>
            </Form>
          </Col>
          <Col md={4} style={{ maxHeight: "450px", overflowY: "auto" }}>
            {cards.map((card) => (
              <CardCard
                key={card._id}
                card={card}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </Col>
        </Row>
      </div>
    </div>
  );
}
