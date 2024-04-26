import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { useEffect, useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "../components/CheckoutSteps";
import { useGetUserByIdQuery } from "../hooks/userHook";
import { UserAddress } from "../types/UserInfo";
import { Form, Card, Row, Col, Button, Badge  } from 'react-bootstrap';
import { countries } from "../data/countries";

export default function ShippingAdressPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  // récupération de l'id su user connecté dans le localStorage
  const userConnectedID = JSON.parse(localStorage.getItem("userInfo")!)._id;

  // récupération d'un user avec toutes ses propriétées dans la BDD
  const { data: user, error, isLoading } = useGetUserByIdQuery(userConnectedID);

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [defaultUserAddress, setDefaultUserAddress] = useState<UserAddress>();

  const [fullName, setFullName] = useState(userInfo?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber || "");
  const [street, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (user && user.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  useEffect(() => {
    if (addresses) {
      let defaultAddr = addresses.find((element) => {
        return element.isDefault === true;
      });

      if (defaultAddr) {
        setDefaultUserAddress(defaultAddr);
      }
    }
  }, [addresses]);

  useEffect(() => {
    if (defaultUserAddress) {
      setAddress(defaultUserAddress.street);
      setCity(defaultUserAddress.city);
      setPostalCode(defaultUserAddress.postalCode);
      setCountry(defaultUserAddress.country);
    }
  }, [defaultUserAddress]);

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        phoneNumber,
        street,
        city,
        postalCode,
        country
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({ fullName, phoneNumber, street, city, postalCode, country })
    );
    navigate("/payment");
  };

  const handleAddressClick = (address: UserAddress) => {
      setAddress(address.street);
      setCity(address.city);
      setPostalCode(address.postalCode);
      setCountry(address.country);
  };

  const AddressCard = ({ address, onClick }: { address: UserAddress; onClick: () => void  }) => {
    return (
      <Card style={{ width: '18rem', marginBottom: '1rem', cursor: 'pointer' }} onClick={onClick}>
        <Card.Header>
          {address.country}
          {address.isDefault && <Badge bg="success" className="ms-5">Default</Badge>}
        </Card.Header>
        <Card.Body>
          <Card.Title>{address.street}</Card.Title>
          <Card.Text>
            {address.city}, {address.postalCode}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching one user</div>;

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3={false} step4={false}></CheckoutSteps>

      <div className="container medium-container">
        <h1 className="my-3">Shipping Address</h1>

        
        <Row>
          <Col md={8}>
            <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </Form.Group>



            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                value={street}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="postalCode">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option value={country}>{country}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="mb-3">
              <Button
                type="submit"
                variant="primary"
                style={{ borderRadius: "100px" }}
              >
                Continue
              </Button>
            </div>
            </Form>
          </Col>
          <Col md={4} style={{ maxHeight: '450px', overflowY: 'auto' }}>
          {addresses.map((address) => (
              <AddressCard key={address._id} 
              address={address} 
              onClick={() => handleAddressClick(address)}/>
            ))}
          </Col>
        </Row>
        
      </div>
    </div>
  );
}
