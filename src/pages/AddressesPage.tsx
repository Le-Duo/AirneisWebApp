import { useState, useEffect } from "react";
import { Button, Container, Form, Card, Badge } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import {
  useGetUserByIdQuery,
  useAddAddressMutation,
  useUpdateDefaultAddressMutation,
  useUpdateAddressMutation,
} from "../hooks/userHook";
import { UserAddress } from "../types/UserInfo";
import { countries } from "../data/countries";
import { useTranslation } from 'react-i18next';

export default function AddressesPage() {
  const { t } = useTranslation();
  const userConnectedID = JSON.parse(localStorage.getItem("userInfo")!)._id;
  const { data: user, error, isLoading } = useGetUserByIdQuery(userConnectedID);

  const [addresses, setAddresses] = useState<UserAddress[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressID, setIsEditingAddressID] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { mutateAsync: addAddress } = useAddAddressMutation(userConnectedID);

  const { mutateAsync: updateDefaultAddress } =
    useUpdateDefaultAddressMutation(userConnectedID);
  const { mutateAsync: updateAddress } = useUpdateAddressMutation(
    userConnectedID,
    editingAddressID
  );

  useEffect(() => {
    if (user && user.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCardAddressClick = (
    id: string,
    street: string,
    city: string,
    postalCode: string,
    country: string,
    isDefault: boolean
  ) => {
    setIsEditingAddressID(id);
    setFormData({
      street: street,
      city: city,
      postalCode: postalCode,
      country: country,
      isDefault: isDefault,
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleAddAddressClick = () => {
    setFormData({
      street: "",
      city: "",
      postalCode: "",
      country: "",
      isDefault: false,
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCreating) {
      const newAddress = {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      };
      await addAddress(newAddress);
    } else {
      const updatedAddress = {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      };
      await updateAddress(updatedAddress);
      if (formData.isDefault) {
        await updateDefaultAddress(editingAddressID);
      }
    }
    setFormData({
      street: "",
      city: "",
      postalCode: "",
      country: "",
      isDefault: false,
    });
    window.location.reload();
  };

  const AddressCardHTML = ({
    _id,
    street,
    city,
    postalCode,
    country,
    isDefault,
  }: UserAddress) => {
    return (
      <Card
        className="address-card"
        onClick={() =>
          handleCardAddressClick(
            _id,
            street,
            city,
            postalCode,
            country,
            isDefault
          )
        }
      >
        {isDefault && <Badge bg="success" className="default-badge">{t('Default')}</Badge>}
        <Card.Body>
          <Card.Title className="card-street">{street}</Card.Title>
          <Card.Text className="card-postalCode">
            {postalCode} {city}, {country}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  };

  if (isLoading) return <div>{t('Loading...')}</div>;
  if (error) return <div>{t('Error fetching one user')}</div>;

  return (
    <Container className="medium-container">
      <Helmet>
        <title>{t('Addresses')}</title>
      </Helmet>
      <h1 className="my-3">{t('Addresses')}</h1>

      <h4 className="mt-5">{t('Saved addresses')}</h4>
      <div className="container">
        <div className="row">
          {addresses.map((address) => (
            <div key={address._id} className="col-md-6 mb-4">
              <AddressCardHTML {...address} />
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleAddAddressClick}>
        {t('Add a new address')}
      </Button>

      {isEditing || isCreating ? (
        <Form onSubmit={handleSubmitForm}>
          <Form.Group className="mb-3" controlId="street">
            <Form.Label>{t('Street')}</Form.Label>
            <Form.Control
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="city">
            <Form.Label>{t('City')}</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              maxLength={50}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>{t('Postal Code')}</Form.Label>
            <Form.Control
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="country">
            <Form.Label>{t('Country')}</Form.Label>
            <Form.Select
              value={formData.country}
              name="country"
              onChange={handleChangeSelect}
              required
            >
              <option value="">{t('Select Country')}</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="isDefault">
            <Form.Check
              type="checkbox"
              label={t('Default shipping address')}
              name="isDefault"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData({ ...formData, isDefault: e.target.checked })
              }
            />
          </Form.Group>

          <div className="mb-3">
            {isCreating ? (
              <Button type="submit" style={{ borderRadius: "100px" }}>
                {t('Create new')}
              </Button>
            ) : (
              <Button
                type="submit"
                id="updateAddressBtn"
                style={{ borderRadius: "100px" }}
              >
                {t('Update')}
              </Button>
            )}
          </div>
        </Form>
      ) : null}
    </Container>
  );
}
