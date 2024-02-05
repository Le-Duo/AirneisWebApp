import { useContext } from 'react'
import { Store } from '../Store'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoute = () => {
  const {
    state: { userInfo },
  } = useContext(Store)

  // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
  // ou n'est pas un administrateur
  if (!userInfo || !userInfo.isAdmin) {
    return <Navigate to="/signin" />
  }

  return <Outlet />
}

export default AdminRoute
