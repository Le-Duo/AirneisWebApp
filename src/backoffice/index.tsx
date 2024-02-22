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
      <Nav variant="tabs" defaultActiveKey="/backoffice">
        <LinkContainer to="/backoffice">
          <Nav.Link>Tableau de Bord</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/backoffice/orders">
          <Nav.Link>Liste des Commandes</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/backoffice/users">
          <Nav.Link>Liste des Utilisateurs</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/backoffice/products">
          <Nav.Link>Liste des Produits</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/backoffice/carousel">
          <Nav.Link>Carousel</Nav.Link>
        </LinkContainer>
      </Nav>
      <Outlet />
    </>
  )
}
