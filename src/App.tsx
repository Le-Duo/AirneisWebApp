import { Container, Navbar, NavbarBrand, Nav, Badge, Button, Offcanvas } from 'react-bootstrap'
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Store } from './Store'
import { useContext, useEffect, useState } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { LinkContainer } from 'react-router-bootstrap'
import { useMediaQuery } from 'react-responsive'
import { useGetCategoriesQuery } from './hooks/categoryHook'
import useScrollToTop from './hooks/useScrollToTop';

function App() {
  useScrollToTop(); 

  const {
    state: { mode, cart, userInfo },
    dispatch,
  } = useContext(Store)

  const isDesktopOrPhone = useMediaQuery({
    query: '(min-width: 992px)',
  })

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', mode)
  }, [mode])

  const { data: categories } = useGetCategoriesQuery()

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

  const location = useLocation();
  const isBackoffice = location.pathname.startsWith('/backoffice');

  const [showOffcanvas, setShowOffcanvas] = useState(false); // Add state for offcanvas visibility

  const handleCloseOffcanvas = () => setShowOffcanvas(false); // Helper function to close offcanvas

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
                <Navbar.Toggle aria-controls='offcanvasNavbar' className='ms-2' onClick={() => setShowOffcanvas(!showOffcanvas)} />
              </div>
              <Navbar.Offcanvas
                id='offcanvasNavbar'
                aria-labelledby='offcanvasNavbarLabel'
                placement='end'
                show={showOffcanvas} // Control visibility with state
                onHide={handleCloseOffcanvas} // Handle hiding offcanvas
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
                          <LinkContainer to='/backoffice' onClick={handleCloseOffcanvas}>
                            <Nav.Link>Backoffice</Nav.Link>
                          </LinkContainer>
                        )}
                        <LinkContainer to='/profile' onClick={handleCloseOffcanvas}>
                          <Nav.Link>My Settings</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/orderhistory' onClick={handleCloseOffcanvas}>
                          <Nav.Link>My Orders</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/tos' onClick={handleCloseOffcanvas}>
                          <Nav.Link>Terms of Service</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/legal-notice' onClick={handleCloseOffcanvas}>
                          <Nav.Link>Legal Notice</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/contact' onClick={handleCloseOffcanvas}>
                          <Nav.Link>Contact</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/about' onClick={handleCloseOffcanvas}>
                          <Nav.Link>About AIRNEIS</Nav.Link>
                        </LinkContainer>
                        <Nav.Link onClick={signoutHandler}>Sign Out</Nav.Link>
                      </>
                    ) : (
                      <>
                        <LinkContainer to='/signin' onClick={handleCloseOffcanvas}>
                          <Nav.Link>Sign In</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/signup' onClick={handleCloseOffcanvas}>
                          <Nav.Link>Sign Up</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/tos' onClick={handleCloseOffcanvas}>
                          <Nav.Link>Terms of Service</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/legal-notice' onClick={handleCloseOffcanvas}>
                          <Nav.Link>Legal Notice</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/contact' onClick={handleCloseOffcanvas}>
                          <Nav.Link>Contact</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/about' onClick={handleCloseOffcanvas}>
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
        {!isBackoffice && (
          <footer>
            {isDesktopOrPhone && (
              <div className="container pt-5">
                <div className="row">
                  <div className="col-6 col-md-2 mb-3">
                    <h5>Sections</h5>
                    <ul className="nav flex-column">
                      <li className="nav-item mb-2"><RouterLink to="/" className="nav-link p-0 text-body-secondary">Home</RouterLink></li>
                      <li className="nav-item mb-2"><RouterLink to="/tos" className="nav-link p-0 text-body-secondary">Terms of Services</RouterLink></li>
                      <li className="nav-item mb-2"><RouterLink to="/legal-notice" className="nav-link p-0 text-body-secondary">Legal Notice</RouterLink></li>
                      <li className="nav-item mb-2"><RouterLink to="/contact" className="nav-link p-0 text-body-secondary">Contact</RouterLink></li>
                      <li className="nav-item mb-2"><RouterLink to="/about" className="nav-link p-0 text-body-secondary">About</RouterLink></li>
                    </ul>
                  </div>
                  <div className="col-6 col-md-2 mb-3">
                    <h5>Shop</h5>
                    <ul className="nav flex-column">
                      <li className="nav-item mb-2"><RouterLink to="/search" className="nav-link p-0 text-body-secondary">Search</RouterLink></li>
                      <li className="nav-item mb-2"><RouterLink to="/cart" className="nav-link p-0 text-body-secondary">Cart</RouterLink></li>
                    </ul>
                  </div>
                  <div className="col-6 col-md-2 mb-3">
                    <h5>Categories</h5>
                    <ul className="nav flex-column">
                      {categories?.map(category => (
                        <li className="nav-item mb-2" key={category._id}>
                          <RouterLink to={`/products?category=${category.name}`} className="nav-link p-0 text-body-secondary">
                            {category.name}
                          </RouterLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-5 offset-md-1 mb-3">
                    <form>
                      <h5>Subscribe to our newsletter</h5>
                      <p>Monthly digest of what's new and exciting from us.</p>
                      <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                        <Button className="coming-soon" disabled>Coming soon</Button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
                  <p>© 2024 Airneis. All rights reserved.</p>
                  <ul className="list-unstyled d-flex">
                    <li className="ms-3"><a className="link-body-emphasis" href="https://twitter.com/airneis"><i className="fab fa-twitter"></i></a></li>
                    <li className="ms-3"><a className="link-body-emphasis" href="https://instagram.com/airneis"><i className="fab fa-instagram"></i></a></li>
                    <li className="ms-3"><a className="link-body-emphasis" href="https://facebook.com/airneis"><i className="fab fa-facebook-f"></i></a></li>
                  </ul>
                </div>
                </div>
              )}
            </footer>
          )}
        </div>
    </>
  )
}
export default App
