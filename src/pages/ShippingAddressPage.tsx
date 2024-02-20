import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { useEffect, useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "../components/CheckoutSteps";
import { Button, Form } from "react-bootstrap";
import { countries } from "../data/countries";
import { ShippingAddress } from "../types/shippingAddress";
import { useShippingAddresses, useCreateShippingAddress } from "../hooks/shippingAddressHook";

export default function ShippingAddressPage() {
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

  const [firstName, setFirstName] = useState(shippingAddress.firstName || "");
  const [lastName, setLastName] = useState(shippingAddress.lastName || "");
  const [street, setStreet] = useState(shippingAddress.street || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [phone, setPhone] = useState(shippingAddress.phone || "");

  const { mutate: createShippingAddress, status, error: saveError } = useCreateShippingAddress();
  const isSaving = status === 'pending';

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        user: userInfo?._id || "",
        firstName,
        lastName,
        street,
        city,
        postalCode,
        country,
        phone,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({ firstName, lastName, street, city, postalCode, country })
    );
    navigate("/payment");
  };
  const { data: addresses, isLoading, error } = useShippingAddresses();

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAddressId = e.target.value;
    const selectedAddress = addresses?.find(address => address._id === selectedAddressId);
    if (selectedAddress) {
      setFirstName(selectedAddress.firstName);
      setLastName(selectedAddress.lastName);
      setStreet(selectedAddress.street);
      setCity(selectedAddress.city);
      setPostalCode(selectedAddress.postalCode);
      setCountry(selectedAddress.country);
      setPhone(selectedAddress.phone);
    }
  };

  const saveAddressHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission when clicking "Save Address"
    const newAddress = {
      firstName,
      lastName,
      street,
      city,
      postalCode,
      country,
      phone,
      user: userInfo?._id || "",
    };
    createShippingAddress(newAddress, {
      onSuccess: () => {
        // Handle success, e.g., show a success message or refresh the list of addresses
        console.log("Address saved successfully");
      },
      onError: (error) => {
        // Handle error, e.g., show an error message
        console.error("Error saving address:", error);
      },
    });
  };
  
  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3={false} step4={false}></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={submitHandler}>
          {/* select already saved adresses */}
          <Form.Group className="mb-3" controlId="addressSelect">
            <Form.Label>Choose an existing address</Form.Label>
            <Form.Select onChange={handleAddressChange}>
              <option value="">Select...</option>
              {isLoading ? (
                <option>Loading addresses...</option>
              ) : error ? (
                <option>Error fetching addresses</option>
              ) : (
                addresses?.map((address: ShippingAddress) => (
                  <option key={address._id} value={address._id}>
                    {address.street}, {address.city}, {address.country}
                  </option>
                ))
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={street}
              onChange={(e) => setStreet(e.target.value)}
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
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button
              variant="primary"
              type="submit"
              style={{ marginRight: "10px", borderRadius: "100px" }}
            >
              Continue
            </Button>
            <Button
              variant="secondary"
              disabled={isSaving}
              onClick={saveAddressHandler}
              style={{ borderRadius: "100px" }}
            >
              {isSaving ? "Saving..." : "Save Address"}
            </Button>
          </div>
          {/* Optionally display saveError if needed */}
          {saveError && <div>Error saving the address. Please try again.</div>}
        </Form>
      </div>
    </div>
  );
}