import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { UserInfo } from '../../types/UserInfo'
import { useUpdateUserMutation } from '../../hooks/userHook'

interface EditUserModalProps {
  show: boolean
  onHide: () => void
  user: UserInfo
  onUserUpdate: () => void
}

const EditUserModal: React.FC<EditUserModalProps> = ({ show, onHide, user, onUserUpdate }) => {
  const [editedUser, setEditedUser] = useState<UserInfo>({
    ...user,
    isAdmin: !!user.isAdmin,
  })
  const { mutateAsync: updateUser } = useUpdateUserMutation()

  useEffect(() => {
    setEditedUser({
      ...user,
      isAdmin: !!user.isAdmin,
    })
  }, [user])

  const handleChange = (name: string, value: string | boolean) => {
    if (name === 'admin') {
      setEditedUser(prev => ({ ...prev, isAdmin: value === 'true' }))
    } else {
      setEditedUser(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUser(editedUser)
      onUserUpdate()
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      onHide()
    }
  }

  return (
    <Modal show={show} onHide={onHide} size='lg' scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              name='name'
              value={editedUser.name}
              onChange={e => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              name='email'
              value={editedUser.email}
              onChange={e => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Admin</Form.Label>
            <Form.Select
              name='admin'
              value={editedUser.isAdmin ? 'true' : 'false'} // Directly use boolean expression
              onChange={e => handleChange(e.target.name, e.target.value)}
            >
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </Form.Select>
          </Form.Group>
          <Button variant='primary' type='submit'>
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default EditUserModal
