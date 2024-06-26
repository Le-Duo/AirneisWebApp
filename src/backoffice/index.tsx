import { Outlet } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Helmet } from 'react-helmet-async'

export const NavigationSystem = () => {
  return (
    <>
      <Helmet>
        <title>Backoffice Navigation</title>
      </Helmet>
      <Nav variant="tabs" className='mb-3'>
        <LinkContainer to="/backoffice">
          <Nav.Link>Tableau de Bord</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/backoffice/orders">
          <Nav.Link>Liste des Commandes</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/backoffice/users">
          <Nav.Link>Liste des Utilisateurs</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/backoffice/categories">
          <Nav.Link>Liste des Catégories</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/backoffice/products">
          <Nav.Link>Liste des Produits</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/backoffice/carousel">
          <Nav.Link>Carousel</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/backoffice/contact">
          <Nav.Link>Contact</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/backoffice/featured-products">
          <Nav.Link>Featured products</Nav.Link>
        </LinkContainer>
      </Nav>
      <Outlet />
    </>
  )
}
