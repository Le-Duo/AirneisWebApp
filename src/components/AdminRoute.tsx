import { useContext } from 'react'
import { Store } from '../Store'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoute = () => {
  const {
    state: { userInfo },
  } = useContext(Store)

  if (!userInfo || !userInfo.isAdmin) {
    return <Navigate to="/signin" />
  }

  return <Outlet />
}

export default AdminRoute
