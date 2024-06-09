import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { ApiError } from '../types/APIError';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../hooks/userHook';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
    const { t } = useTranslation();
    const userConnectedID = JSON.parse(localStorage.getItem('userInfo')!)._id;
    const { data: user, error, isLoading } = useGetUserByIdQuery(userConnectedID);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const { mutateAsync: updateProfile } = useUpdateUserMutation(userConnectedID);

    useEffect(() => {
        if (user && user.name) {
            setName(user.name);
        }
        if (user && user.email) {
            setEmail(user.email);
        }
        if (user && user.phoneNumber) {
            setPhoneNumber(user.phoneNumber);
        }
    }, [user]);

    if (isLoading) return <div>{t('Loading...')}</div>;
    if (error) return <div>{t('Error fetching one user')}</div>;

    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            await updateProfile({
                name: name,
                email: email,
                phoneNumber: phoneNumber,
            });

            toast.success(t('Profile updated'));
        } catch (err) {
            console.log(err);
            toast.error(getError(err as ApiError));
        }
    };

    return (
        <Container className="small-container">
            <Helmet>
                <title>{t('Profile')}</title>
            </Helmet>
            <h1 className="my-3">{t('Profile')}</h1>
            <Form onSubmit={submitHandler} ref={formRef}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>{t('Name')}</Form.Label>
                    <Form.Control
                        type="input"
                        required
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>{t('Email')}</Form.Label>
                    <Form.Control
                        type="input"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>{t('Phone Number')}</Form.Label>
                    <Form.Control
                        type="input"
                        required
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        value={phoneNumber}
                    />
                </Form.Group>

                <div className="mb-3">
                    <Button type="submit" style={{ borderRadius: '100px' }}>
                        {t('Update')}
                    </Button>
                </div>
            </Form>
        </Container>
    );
}
