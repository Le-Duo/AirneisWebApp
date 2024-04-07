import { useState, useEffect  } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useGetUserByIdQuery, useUpdateDefaultCardMutation, useAddPaymentCardMutation } from '../hooks/userHook'
import { CreditCard } from './../types/CreditCard'



export default function MyWalletPage(){

    const userConnectedID  =  JSON.parse(localStorage.getItem('userInfo')!)._id
    const { data: user, error, isLoading } = useGetUserByIdQuery(userConnectedID)

    const [ cards, setCards]= useState<CreditCard[]>([]); 

    const { mutateAsync: updateDefaultCard } = useUpdateDefaultCardMutation(userConnectedID)
    const { mutateAsync: addCard } = useAddPaymentCardMutation(userConnectedID)

    const [formData, setFormData] = useState({
        bankName: '',
        number: '',
        fullName: '',
        monthExpiration: '',
        yearExpiration: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newCardData = {
            bankName: formData.bankName,
            number: formData.number,
            fullName: formData.fullName,
            monthExpiration: parseInt(formData.monthExpiration),
            yearExpiration: parseInt(formData.yearExpiration),
        };

        await addCard(newCardData);

        setFormData({
            bankName: '',
            number: '',
            fullName: '',
            monthExpiration: '',
            yearExpiration: '',
        });

        window.location.reload(); // todo, à modifier dans le futur pour ne recharger que la liste
    };
    
    // Design d'une carte de paiement
    const CreditCardHTML = ({ _id, bankName, number, fullName, monthExpiration, yearExpiration, isDefault }: CreditCard) => {
        return (
            <div className="credit-card" onClick={() => handleCardClick(_id)}>
                {isDefault && <div className="default-badge">Default</div>}
                <div className="card-body">
                    <div className="bank-name">{bankName}</div>
                    <div className="card-number">{number}</div>
                    <div className="card-holder">
                        <div className="label">Card Holder</div>
                        <div className="name">{fullName}</div>
                    </div>
                    <div className="expiration">
                        <div className="label">Expires</div>
                        <div className="date">{monthExpiration}/{yearExpiration}</div>
                    </div>
                </div>
            </div>
        );
    };


    useEffect(() => {
        if (user && user.paymentCards) {
            setCards(user.paymentCards);
        }
      }, [user]);


      if (isLoading) return <div>Loading...</div>
      if (error) return <div>Error fetching one user</div>

        const handleCardClick = (cardId: string) => {
            updateDefaultCard(cardId)
            window.location.reload(); // todo, à modifier dans le futur pour ne recharger que la liste
        };

      return (
        <Container className="medium-container">
          <Helmet>
            <title>Wallet</title>
          </Helmet>
            <h1 className="my-3">Wallet</h1>

            <div className="container">
                <h3 className="mt-5">Liste des cartes de paiement :</h3>
                <div className="row">
                    {cards.map(card => (
                        <div key={card._id} className="col-md-6 mb-4">
                            <CreditCardHTML {...card} />
                        </div>
                    ))}
                </div>
            </div>

            <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="bankName">
                <Form.Label>Nom de la banque</Form.Label>
                <Form.Control
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="number">
                <Form.Label>Numéro de carte</Form.Label>
                <Form.Control
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Nom complet du titulaire de la carte</Form.Label>
                <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="expiration">
                <Form.Label>Date d'expiration</Form.Label>
                <div className="d-flex">
                    <Form.Control
                        type="text"
                        placeholder="MM"
                        name="monthExpiration"
                        value={formData.monthExpiration}
                        onChange={handleChange}
                        required
                    />
                    <span className="mx-2">/</span>
                    <Form.Control
                        type="text"
                        placeholder="YYYY"
                        name="yearExpiration"
                        value={formData.yearExpiration}
                        onChange={handleChange}
                        required
                    />
                </div>
            </Form.Group>

            <Button variant="primary" type="submit">
                Ajouter la carte
            </Button>
        </Form>
        </Container>

      )

}