import { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import {
  useGetUserByIdQuery,
  useAddAddressMutation,
  useUpdateDefaultAddressMutation,
  useUpdateAddressMutation,
} from "../hooks/userHook";
import { UserAddress } from "../types/UserInfo";

export default function AddressesPage() {
  const userConnectedID = JSON.parse(localStorage.getItem("userInfo")!)._id;
  const { data: user, error, isLoading } = useGetUserByIdQuery(userConnectedID);

  const [addresses, setAddresses] = useState<UserAddress[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressID, setIsEditingAddressID] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // add address
  const { mutateAsync: addAddress } = useAddAddressMutation(userConnectedID);

  // update address
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

  // Quand on change une valeur dans le forumulaire, récupère la valeur et la met dans la variable
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

  // Quand on clique sur une card pour la modifier
  const handleCardAddressClick = (
    id: string,
    street: string,
    city: string,
    postalCode: string,
    country: string,
    isDefault: boolean
  ) => {
    // sauvegarde l'id de l'adresse en cours e modification dans la variable
    setIsEditingAddressID(id);

    // met les infos dans le formulaire
    setFormData({
      street: street,
      city: city,
      postalCode: postalCode,
      country: country,
      isDefault: isDefault,
    });

    // affiche le formulaire et passe en mode "edition"
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleAddAddressClick = () => {
    // reset le formulaire
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

  // Quand on envoie le formulaire pour ajouter une adresse
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // mode creation
    if (isCreating) {
      const newAddress = {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      };

      await addAddress(newAddress);
    } else {
      // mode edition
      const updatedAddress = {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      };

      // update address
      await updateAddress(updatedAddress);

      // set as default if needed
      if (formData.isDefault) {
        await updateDefaultAddress(editingAddressID);
      }
    }
    // reset le formulaire
    setFormData({
      street: "",
      city: "",
      postalCode: "",
      country: "",
      isDefault: false,
    });

    window.location.reload(); // todo, à modifier dans le futur pour ne recharger que la liste
  };

  // Design d'une carte d'adresse
  const AddressCardHTML = ({
    _id,
    street,
    city,
    postalCode,
    country,
    isDefault,
  }: UserAddress) => {
    return (
      <div
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
        {isDefault && <div className="default-badge">Default</div>}
        <div className="card-body">
          <div className="card-street">
            <div className="street">{street} </div>
          </div>
          <div className="card-postalCode">
            <div className="postalCode">
              {postalCode} {city} {country}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching one user</div>;

  return (
    <Container className="medium-container">
      <Helmet>
        <title>Addresses</title>
      </Helmet>
      <h1 className="my-3">Addresses</h1>

      <h4 className="mt-5">Saved addresses</h4>
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
        Ajouter une nouvelle adresse
      </Button>

      {isEditing || isCreating ? (
        <Form onSubmit={handleSubmitForm}>
          <Form.Group className="mb-3" controlId="street">
            <Form.Label>Street</Form.Label>
            <Form.Control
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Select
              value={formData.country}
              name="country"
              onChange={handleChangeSelect}
              required
            >
              <option value="">Select Country</option>
              <option value="AFG">Afghanistan</option>
              <option value="ALA">Åland Islands</option>
              <option value="ALB">Albania</option>
              <option value="DZA">Algeria</option>
              <option value="ASM">American Samoa</option>
              <option value="AND">Andorra</option>
              <option value="AGO">Angola</option>
              <option value="AIA">Anguilla</option>
              <option value="ATA">Antarctica</option>
              <option value="ATG">Antigua and Barbuda</option>
              <option value="ARG">Argentina</option>
              <option value="ARM">Armenia</option>
              <option value="ABW">Aruba</option>
              <option value="AUS">Australia</option>
              <option value="AUT">Austria</option>
              <option value="AZE">Azerbaijan</option>
              <option value="BHS">Bahamas</option>
              <option value="BHR">Bahrain</option>
              <option value="BGD">Bangladesh</option>
              <option value="BRB">Barbados</option>
              <option value="BLR">Belarus</option>
              <option value="BEL">Belgium</option>
              <option value="BLZ">Belize</option>
              <option value="BEN">Benin</option>
              <option value="BMU">Bermuda</option>
              <option value="BTN">Bhutan</option>
              <option value="BOL">Bolivia (Plurinational State of)</option>
              <option value="BES">Bonaire, Sint Eustatius and Saba</option>
              <option value="BIH">Bosnia and Herzegovina</option>
              <option value="BWA">Botswana</option>
              <option value="BVT">Bouvet Island</option>
              <option value="BRA">Brazil</option>
              <option value="IOT">British Indian Ocean Territory</option>
              <option value="BRN">Brunei Darussalam</option>
              <option value="BGR">Bulgaria</option>
              <option value="BFA">Burkina Faso</option>
              <option value="BDI">Burundi</option>
              <option value="CPV">Cabo Verde</option>
              <option value="KHM">Cambodia</option>
              <option value="CMR">Cameroon</option>
              <option value="CAN">Canada</option>
              <option value="CYM">Cayman Islands</option>
              <option value="CAF">Central African Republic</option>
              <option value="TCD">Chad</option>
              <option value="CHL">Chile</option>
              <option value="CHN">China</option>
              <option value="CXR">Christmas Island</option>
              <option value="CCK">Cocos (Keeling) Islands</option>
              <option value="COL">Colombia</option>
              <option value="COM">Comoros</option>
              <option value="COD">
                Congo (the Democratic Republic of the)
              </option>
              <option value="COG">Congo</option>
              <option value="COK">Cook Islands</option>
              <option value="CRI">Costa Rica</option>
              <option value="HRV">Croatia</option>
              <option value="CUB">Cuba</option>
              <option value="CUW">Curaçao</option>
              <option value="CYP">Cyprus</option>
              <option value="CZE">Czech Republic</option>
              <option value="CIV">Côte d'Ivoire</option>
              <option value="DNK">Denmark</option>
              <option value="DJI">Djibouti</option>
              <option value="DMA">Dominica</option>
              <option value="DOM">Dominican Republic</option>
              <option value="ECU">Ecuador</option>
              <option value="EGY">Egypt</option>
              <option value="SLV">El Salvador</option>
              <option value="GNQ">Equatorial Guinea</option>
              <option value="ERI">Eritrea</option>
              <option value="EST">Estonia</option>
              <option value="SWZ">Eswatini</option>
              <option value="ETH">Ethiopia</option>
              <option value="FLK">Falkland Islands [Malvinas]</option>
              <option value="FRO">Faroe Islands</option>
              <option value="FJI">Fiji</option>
              <option value="FIN">Finland</option>
              <option value="FRA">France</option>
              <option value="GUF">French Guiana</option>
              <option value="PYF">French Polynesia</option>
              <option value="ATF">French Southern Territories</option>
              <option value="GAB">Gabon</option>
              <option value="GMB">Gambia</option>
              <option value="GEO">Georgia</option>
              <option value="DEU">Germany</option>
              <option value="GHA">Ghana</option>
              <option value="GIB">Gibraltar</option>
              <option value="GRC">Greece</option>
              <option value="GRL">Greenland</option>
              <option value="GRD">Grenada</option>
              <option value="GLP">Guadeloupe</option>
              <option value="GUM">Guam</option>
              <option value="GTM">Guatemala</option>
              <option value="GGY">Guernsey</option>
              <option value="GIN">Guinea</option>
              <option value="GNB">Guinea-Bissau</option>
              <option value="GUY">Guyana</option>
              <option value="HTI">Haiti</option>
              <option value="HMD">Heard Island and McDonald Islands</option>
              <option value="VAT">Holy See</option>
              <option value="HND">Honduras</option>
              <option value="HKG">Hong Kong</option>
              <option value="HUN">Hungary</option>
              <option value="ISL">Iceland</option>
              <option value="IND">India</option>
              <option value="IDN">Indonesia</option>
              <option value="IRN">Iran (Islamic Republic of)</option>
              <option value="IRQ">Iraq</option>
              <option value="IRL">Ireland</option>
              <option value="IMN">Isle of Man</option>
              <option value="ISR">Israel</option>
              <option value="ITA">Italy</option>
              <option value="JAM">Jamaica</option>
              <option value="JPN">Japan</option>
              <option value="JEY">Jersey</option>
              <option value="JOR">Jordan</option>
              <option value="KAZ">Kazakhstan</option>
              <option value="KEN">Kenya</option>
              <option value="KIR">Kiribati</option>
              <option value="PRK">
                Korea (the Democratic People's Republic of)
              </option>
              <option value="KOR">Korea (the Republic of)</option>
              <option value="KWT">Kuwait</option>
              <option value="KGZ">Kyrgyzstan</option>
              <option value="LAO">Lao People's Democratic Republic</option>
              <option value="LVA">Latvia</option>
              <option value="LBN">Lebanon</option>
              <option value="LSO">Lesotho</option>
              <option value="LBR">Liberia</option>
              <option value="LBY">Libya</option>
              <option value="LIE">Liechtenstein</option>
              <option value="LTU">Lithuania</option>
              <option value="LUX">Luxembourg</option>
              <option value="MAC">Macao</option>
              <option value="MDG">Madagascar</option>
              <option value="MWI">Malawi</option>
              <option value="MYS">Malaysia</option>
              <option value="MDV">Maldives</option>
              <option value="MLI">Mali</option>
              <option value="MLT">Malta</option>
              <option value="MHL">Marshall Islands</option>
              <option value="MTQ">Martinique</option>
              <option value="MRT">Mauritania</option>
              <option value="MUS">Mauritius</option>
              <option value="MYT">Mayotte</option>
              <option value="MEX">Mexico</option>
              <option value="FSM">Micronesia (Federated States of)</option>
              <option value="MDA">Moldova (the Republic of)</option>
              <option value="MCO">Monaco</option>
              <option value="MNG">Mongolia</option>
              <option value="MNE">Montenegro</option>
              <option value="MSR">Montserrat</option>
              <option value="MAR">Morocco</option>
              <option value="MOZ">Mozambique</option>
              <option value="MMR">Myanmar</option>
              <option value="NAM">Namibia</option>
              <option value="NRU">Nauru</option>
              <option value="NPL">Nepal</option>
              <option value="NLD">Netherlands</option>
              <option value="NCL">New Caledonia</option>
              <option value="NZL">New Zealand</option>
              <option value="NIC">Nicaragua</option>
              <option value="NER">Niger</option>
              <option value="NGA">Nigeria</option>
              <option value="NIU">Niue</option>
              <option value="NFK">Norfolk Island</option>
              <option value="MKD">North Macedonia</option>
              <option value="MNP">Northern Mariana Islands</option>
              <option value="NOR">Norway</option>
              <option value="OMN">Oman</option>
              <option value="PAK">Pakistan</option>
              <option value="PLW">Palau</option>
              <option value="PSE">Palestine, State of</option>
              <option value="PAN">Panama</option>
              <option value="PNG">Papua New Guinea</option>
              <option value="PRY">Paraguay</option>
              <option value="PER">Peru</option>
              <option value="PHL">Philippines</option>
              <option value="PCN">Pitcairn</option>
              <option value="POL">Poland</option>
              <option value="PRT">Portugal</option>
              <option value="PRI">Puerto Rico</option>
              <option value="QAT">Qatar</option>
              <option value="ROU">Romania</option>
              <option value="RUS">Russian Federation</option>
              <option value="RWA">Rwanda</option>
              <option value="REU">Réunion</option>
              <option value="BLM">Saint Barthélemy</option>
              <option value="SHN">
                Saint Helena, Ascension and Tristan da Cunha
              </option>
              <option value="KNA">Saint Kitts and Nevis</option>
              <option value="LCA">Saint Lucia</option>
              <option value="MAF">Saint Martin (French part)</option>
              <option value="SPM">Saint Pierre and Miquelon</option>
              <option value="VCT">Saint Vincent and the Grenadines</option>
              <option value="WSM">Samoa</option>
              <option value="SMR">San Marino</option>
              <option value="STP">Sao Tome and Principe</option>
              <option value="SAU">Saudi Arabia</option>
              <option value="SEN">Senegal</option>
              <option value="SRB">Serbia</option>
              <option value="SYC">Seychelles</option>
              <option value="SLE">Sierra Leone</option>
              <option value="SGP">Singapore</option>
              <option value="SXM">Sint Maarten (Dutch part)</option>
              <option value="SVK">Slovakia</option>
              <option value="SVN">Slovenia</option>
              <option value="SLB">Solomon Islands</option>
              <option value="SOM">Somalia</option>
              <option value="ZAF">South Africa</option>
              <option value="SGS">
                South Georgia and the South Sandwich Islands
              </option>
              <option value="SSD">South Sudan</option>
              <option value="ESP">Spain</option>
              <option value="LKA">Sri Lanka</option>
              <option value="SDN">Sudan</option>
              <option value="SUR">Suriname</option>
              <option value="SJM">Svalbard and Jan Mayen</option>
              <option value="SWE">Sweden</option>
              <option value="CHE">Switzerland</option>
              <option value="SYR">Syrian Arab Republic</option>
              <option value="TWN">Taiwan</option>
              <option value="TJK">Tajikistan</option>
              <option value="TZA">Tanzania, United Republic of</option>
              <option value="THA">Thailand</option>
              <option value="TLS">Timor-Leste</option>
              <option value="TGO">Togo</option>
              <option value="TKL">Tokelau</option>
              <option value="TON">Tonga</option>
              <option value="TTO">Trinidad and Tobago</option>
              <option value="TUN">Tunisia</option>
              <option value="TUR">Turkey</option>
              <option value="TKM">Turkmenistan</option>
              <option value="TCA">Turks and Caicos Islands</option>
              <option value="TUV">Tuvalu</option>
              <option value="UGA">Uganda</option>
              <option value="UKR">Ukraine</option>
              <option value="ARE">United Arab Emirates</option>
              <option value="GBR">
                United Kingdom of Great Britain and Northern Ireland
              </option>
              <option value="UMI">United States Minor Outlying Islands</option>
              <option value="USA">United States of America</option>
              <option value="URY">Uruguay</option>
              <option value="UZB">Uzbekistan</option>
              <option value="VUT">Vanuatu</option>
              <option value="VEN">Venezuela (Bolivarian Republic of)</option>
              <option value="VNM">Viet Nam</option>
              <option value="VGB">Virgin Islands (British)</option>
              <option value="VIR">Virgin Islands (U.S.)</option>
              <option value="WLF">Wallis and Futuna</option>
              <option value="ESH">Western Sahara</option>
              <option value="YEM">Yemen</option>
              <option value="ZMB">Zambia</option>
              <option value="ZWE">Zimbabwe</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="isDefault">
            <Form.Check
              type="checkbox"
              label="Default shipping address"
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
                {" "}
                Create new{" "}
              </Button>
            ) : (
              <Button
                type="submit"
                id="updateAddressBtn"
                style={{ borderRadius: "100px" }}
              >
                {" "}
                Update{" "}
              </Button>
            )}
          </div>
        </Form>
      ) : null}
    </Container>
  );
}
