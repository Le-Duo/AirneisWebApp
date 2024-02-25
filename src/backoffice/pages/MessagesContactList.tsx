import { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useGetContactQuery } from '../../hooks/contactHook'
import { Contact } from '../../types/Contact'


const ContactList = () => {
  const { data: contacts, error, isLoading } = useGetContactQuery()
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  useEffect(() => {}, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching users</div>

  const handleSelectUser = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
        setSelectedContacts(selectedContacts.filter((id) => id !== contactId))
    } else {
        setSelectedContacts([...selectedContacts, contactId])
    }
  }

  return (
    <div>
      <Helmet>
        <title>Users List</title>
      </Helmet>
      <h2>Liste des Utilisateurs</h2>
      <Table striped bordered hover>
        <thead>
        <tr>
        <th className="col-1">Select</th>
        <th className="col-2">Mail</th>
        <th className="col-3">Subject</th>
        <th className="col-6">Message</th>
      </tr>
        </thead>
        <tbody>
          {contacts?.map((contact: Contact) => {
            if (typeof contact._id === 'string') {
              return (
                <tr key={contact._id} onClick={() => handleSelectUser(contact._id!)}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact._id)}
                      onChange={() => {}}
                    />
                  </td>
                  <td>{contact.mail}</td>
                  <td>{contact.subject}</td>
                  <td>{contact.message}</td>

                 
                </tr>
              )
            }
            return null
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default ContactList
