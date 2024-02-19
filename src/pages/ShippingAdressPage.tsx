import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../components/CheckoutSteps';
import { Button, Form } from 'react-bootstrap';
import { countries } from '../data/countries';
import { useShippingAddresses } from '../hooks/shippingAdressHook'; // Import the hook

export default function ShippingAdressPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { userInfo, cart: { shippingAddress } } = state;
  const { data: existingAddresses, isLoading, error } = useShippingAddresses(); // Use the hook

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const [firstName, setFirstName] = useState(shippingAddress.firstName || '');
  const [lastName, setLastName] = useState(shippingAddress.lastName || '');
  const [street, setStreet] = useState(shippingAddress.street || '');
  const [street2, setStreet2] = useState(shippingAddress.street2 || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [phone, setPhone] = useState(shippingAddress.phone || '');
  const [selectedAddress, setSelectedAddress] = useState('');

  const handleAddressChange = (e: any) => {
    const selected = e.target.value;
    setSelectedAddress(selected);
    if (selected === 'newAddress') {
      setFirstName('');
      setLastName('');
      setStreet('');
      setStreet2('');
      setCity('');
      setPostalCode('');
      setCountry('');
      setPhone('');
    } else {
      const address = existingAddresses.find((addr: any) => addr.id === selected);
      if (address) {
        setFirstName(address.firstName);
        setLastName(address.lastName);
        setStreet(address.street);
        setStreet2(address.street2 || '');
        setCity(address.city);
        setPostalCode(address.postalCode);
        setCountry(address.country);
        setPhone(address.phone);
      }
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (!userInfo) {
      console.error('User info is null, cannot save shipping address.');
      return;
    }
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        user: userInfo._id,
        firstName,
        lastName,
        street,
        street2,
        city,
        postalCode,
        country,
        phone
      },
    });
    localStorage.setItem('shippingAddress', JSON.stringify({ firstName, lastName, street, street2, city, postalCode, country, phone }));
    navigate('/payment');
  };

  if (isLoading) return <div>Loading...</div>; // Handle loading state
  if (error) return <div>An error occurred: {error.message}</div>; // Handle error state

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3={false} step4={false}></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Select an existing address or add a new one</Form.Label>
            <Form.Select value={selectedAddress} onChange={handleAddressChange} required>
              <option value="">Select Address</option>
              {existingAddresses.map((addr: any) => (
                <option key={addr.id} value={addr.id}>
                  {addr.firstName} {addr.lastName}, {addr.street}, {addr.city}, {addr.postalCode}, {addr.country}
                </option>
              ))}
              <option value="newAddress">Add a new address</option>
              </Form.Select>
          </Form.Group>
          {selectedAddress === 'newAddress' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Street Address Line 2</Form.Label>
                <Form.Control
                  type="text"
                  value={street2}
                  onChange={(e) => setStreet2(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((countryName) => (
                    <option key={countryName} value={countryName}>
                      {countryName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Form.Group>
            </>
          )}
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}