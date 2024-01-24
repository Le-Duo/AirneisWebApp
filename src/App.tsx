import {
  Container,
  Navbar,
  NavbarBrand,
  Nav,
  Badge,
  NavDropdown,
} from 'react-bootstrap'
import { Outlet, Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Store } from './Store'
import { useContext } from 'react'
import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { LinkContainer } from 'react-router-bootstrap'

function App() {
  const {
    state: { mode, cart, userInfo }, // Récupération de l'état de l'application
    dispatch, // Récupération de la fonction dispatch pour envoyer des actions au store
  } = useContext(Store) // Utilisation du hook useContext pour accéder au store

  useEffect(() => {
    // Utilisation du hook useEffect pour gérer les effets de bord
    document.body.setAttribute('data-bs-theme', mode) // Changement du thème en fonction du mode
  }, [mode]) // Dépendance du hook useEffect au mode

  const switchModeHandler = () => {
    // Définition de la fonction pour changer de mode
    dispatch({ type: 'SWITCH_MODE' }) // Envoi de l'action SWITCH_MODE au store
  }

  const signoutHandler = () => {
    dispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('cartItems')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    window.location.href = '/signin'
  }

  return (
    // Rendu du composant App
    <>
      <div className="d-flex flex-column vh-100">
        {/* // Conteneur des notifications */}
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar expand="lg">
            <Container>
              <LinkContainer to="/">
                <NavbarBrand>Airneis</NavbarBrand>
              </LinkContainer>
            </Container>
            <Nav>
              <Button variant={mode} onClick={switchModeHandler}>
                <i
                  className={
                    mode === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon' // Changement de l'icône en fonction du mode
                  }
                ></i>
              </Button>
              <Link to="/cart" className="nav-link">
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="danger">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
              {userInfo ? ( //si unserInfo existe
                // affiche le nom de l'utilisateur dans le dropdown
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <Link
                    className="dropdown-item"
                    to="#signout"
                    onClick={signoutHandler}
                  >
                    Sign Out
                  </Link>
                </NavDropdown>
              ) : (
                // sinon affiche le lien vers la page de connexion
                <Link className="nav-link" to="/signin">
                  Sign In
                </Link>
              )}
            </Nav>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Outlet />
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </>
  )
}
export default App // Exportation du composant App
