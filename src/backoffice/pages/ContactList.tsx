import { Helmet } from 'react-helmet-async'
import { useContactsQuery } from '../../hooks/contactHook'
import Table from '../components/Table'
import { Contact } from '../../types/Contact'

const ContactList = () => {
    const { data, isSuccess, isError, error, isLoading } = useContactsQuery()

    console.log('Fetching contacts:', isSuccess ? 'Success' : 'Failed', data);

    if (isLoading) {
        console.log('Fetching contacts: Loading');
    } else {
        console.log('Fetching contacts:', isSuccess ? 'Success' : 'Failed', data);
    }

    if (isError) {
        console.error('Error fetching contacts:', error);
        return <div>Error loading contacts.</div>;
    }

    if (!isSuccess || !data) {
        return <div>Loading...</div>;
    }

    const contacts = data.contacts;

    const columns: Array<{ key: keyof Contact; label: string }> = [
        { key: 'mail', label: 'Email' },
        { key: 'subject', label: 'Subject' },
        { key: 'message', label: 'Message' },
        { key: 'user', label: 'User' },
    ]

    console.log('Columns for table:', columns);

    return (
        <div>
            <Helmet>
                <title>Contact List | Airneis</title>
            </Helmet>
            <h1>Contact List</h1>
            <Table
                data={contacts}
                columns={columns}
            />
        </div>
    )
}

export default ContactList