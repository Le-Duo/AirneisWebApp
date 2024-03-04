import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Table, Button, Form } from 'react-bootstrap'
import { Contact } from '../../types/Contact'
import {
    useCreateContactMutation
} from '../../hooks/contactHook'

const ContactList = () => {
    const createContactMutation = useCreateContactMutation()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleCreateContact = async () => {
        await createContactMutation.mutateAsync({
            name: name,
            email: email,
            message: message
        })
        setName('')
        setEmail('')
        setMessage('')
    }

    return (
        <div>
            <Helmet>
                <title>Contact List | Airneis</title>
            </Helmet>
            <h1>Contact List</h1>
            <Form>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="message">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                        as="textarea"
                        placeholder="Enter message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleCreateContact}>
                    Create
                </Button>
            </Form>
        </div>
    )
}