// Importations nécessaires
import { useState } from 'react';
import { useGetProductsQuery } from '../hooks/productHook';
import Fuse from 'fuse.js';
import ProductItem from '../components/ProductItem';
import { Row, Col } from 'react-bootstrap';

export default function SearchPage() {
  const { data: products } = useGetProductsQuery();
  const [searchResults, setSearchResults] = useState([]);

  // Fonction pour gérer la recherche
  const handleSearch = (searchCriteria) => {
    // Utilisez Fuse.js pour la recherche textuelle
    const fuse = new Fuse(products, {
      keys: ['name'],
    });

    const results = fuse.search(searchCriteria.text);
    // Appliquez les autres filtres et le tri sur les résultats
    // ...

    setSearchResults(results.map(result => result.item));
  };

  return (
    <div>
      {/* Formulaire de recherche */}
      {/* ... */}
      <Row>
        {searchResults.map((product) => (
          <Col key={product.slug} sm={6} md={4} lg={3}>
            <ProductItem product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
