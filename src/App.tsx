import { Container, Navbar, NavbarBrand, Nav, Badge } from 'react-bootstrap'
import { Outlet, Link } from 'react-router-dom'
import { Store } from './Store'
import { useContext } from 'react'
import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import '@fortawesome/fontawesome-free/css/all.min.css'

function App() {
  const {
    state: { mode, cart }, // Récupération de l'état de l'application
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

  return (
    // Rendu du composant App
    <>
      <div className="d-flex flex-column vh-100">
        <header>
          <Navbar expand="lg">
            <Container>
              <NavbarBrand>Airneis</NavbarBrand>
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
              <a href="/signin" className="nav-link"></a>
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
