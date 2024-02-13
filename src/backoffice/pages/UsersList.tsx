import { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useGetUsersQuery } from '../../hooks/userHook'
import { UserInfo } from '../../types/UserInfo'

const UsersList = () => {
  const { data: users, error, isLoading } = useGetUsersQuery()
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  useEffect(() => {}, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching users</div>

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
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
            <th>Select</th>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: UserInfo) => {
            if (typeof user._id === 'string') {
              return (
                <tr key={user._id} onClick={() => handleSelectUser(user._id!)}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => {}}
                    />
                  </td>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.isAdmin ? (
                      <i
                        className="fas fa-check-circle"
                        style={{ color: 'green' }}
                      ></i>
                    ) : (
                      <i
                        className="fas fa-times-circle"
                        style={{ color: 'red' }}
                      ></i>
                    )}
                  </td>
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

export default UsersList
