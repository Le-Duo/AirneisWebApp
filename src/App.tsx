import { Container, Navbar, NavbarBrand, Nav, Badge } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Store } from './Store'
import { useContext } from 'react'
import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { LinkContainer } from 'react-router-bootstrap'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'

function App() {
  const {
    state: { mode, cart, userInfo },
    dispatch,
  } = useContext(Store)

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)',
  })

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', mode)
  }, [mode])

  const switchModeHandler = () => {
    dispatch({ type: 'SWITCH_MODE' })
  }

  const signoutHandler = () => {
    dispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('cartItems')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    window.location.href = '/'
  }

  return (
    <>
      <div className='d-flex flex-column vh-100'>
        <ToastContainer position='bottom-center' limit={1} />
        <header>
          <Navbar expand={false} className='justify-content-between'>
            <Container>
              <LinkContainer to='/'>
                <NavbarBrand>
                  <img
                    src='/images/airneis.svg'
                    alt='logo'
                    style={{ maxWidth: '40px', height: 'auto', padding: '4px' }}
                  />
                </NavbarBrand>
              </LinkContainer>
              <div className='d-flex align-items-center'>
                <Button
                  variant={mode}
                  onClick={() => (window.location.href = '/search')}
                  className='me-auto'
                >
                  <i className='fa-sharp fa-solid fa-search'></i>
                </Button>
                <Button
                  variant={mode}
                  onClick={() => (window.location.href = '/cart')}
                  className='ms-2'
                >
                  <i className='fa-sharp fa-solid fa-cart-shopping'></i>
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg='danger'>
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Button>
                <Button variant={mode} onClick={switchModeHandler} className='ms-2'>
                  <i
                    className={
                      mode === 'light' ? 'fa-sharp fa-solid fa-sun' : 'fa-sharp fa-solid fa-moon'
                    }
                  ></i>
                </Button>
                <Navbar.Toggle aria-controls='offcanvasNavbar' className='ms-2' />
              </div>
              <Navbar.Offcanvas
                id='offcanvasNavbar'
                aria-labelledby='offcanvasNavbarLabel'
                placement='end'
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id='offcanvasNavbarLabel'>
                    {userInfo ? <span>Halo, {userInfo.name}!</span> : <span>Menu</span>}
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className='justify-content-end flex-grow-1 pe-3'>
                    {userInfo ? (
                      <>
                        {userInfo.isAdmin && (
                          <LinkContainer to='/backoffice'>
                            <Nav.Link>Backoffice</Nav.Link>
                          </LinkContainer>
                        )}
                        <LinkContainer to='/profile'>
                          <Nav.Link>My Settings</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/orderhistory'>
                          <Nav.Link>My Orders</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/tos'>
                          <Nav.Link>Terms of Service</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/legal-notice'>
                          <Nav.Link>Legal Notice</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/contact'>
                          <Nav.Link>Contact</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/about'>
                          <Nav.Link>About AIRNEIS</Nav.Link>
                        </LinkContainer>
                        <Nav.Link onClick={signoutHandler}>Sign Out</Nav.Link>
                      </>
                    ) : (
                      <>
                        <LinkContainer to='/signin'>
                          <Nav.Link>Sign In</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/signup'>
                          <Nav.Link>Sign Up</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/tos'>
                          <Nav.Link>Terms of Service</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/legal-notice'>
                          <Nav.Link>Legal Notice</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/contact'>
                          <Nav.Link>Contact</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/about'>
                          <Nav.Link>About AIRNEIS</Nav.Link>
                        </LinkContainer>
                      </>
                    )}
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container fluid className='mt-3'>
            <Outlet />
          </Container>
        </main>
        <footer>
          {isDesktopOrLaptop && (
            <div className='desktop-footer'>
              <div className='icon-links'>
                <a href='https://facebook.com/airneis' target='_blank' rel='noopener noreferrer'>
                  <i className='fab fa-facebook-f'></i>
                </a>
                <a href='https://twitter.com/airneis' target='_blank' rel='noopener noreferrer'>
                  <i className='fab fa-twitter'></i>
                </a>
                <a href='https://instagram.com/airneis' target='_blank' rel='noopener noreferrer'>
                  <i className='fab fa-instagram'></i>
                </a>
              </div>
              <div className='text-links'>
                <Link to='/tos'>Terms of Service</Link>
                <Link to='/legal-notice'>Legal Notice</Link>
                <Link to='/contact'>Contact</Link>
              </div>
            </div>
          )}
        </footer>
      </div>
    </>
  )
}
export default App
