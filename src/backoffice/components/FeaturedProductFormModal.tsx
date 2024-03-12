import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { Product } from '../../types/Product';

interface FeaturedProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedProductId: string) => void;
  products: Product[];
}

const FeaturedProductFormModal: React.FC<FeaturedProductFormModalProps> = ({ isOpen, onClose, onSubmit, products }) => {
  const [selectedProductId, setSelectedProductId] = React.useState('');

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleSubmit = () => {
    onSubmit(selectedProductId);
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Select Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row xs={1} md={2} lg={3} className="g-4 m-1" >
          {products.map((product) => (
            <Col key={product._id} onClick={() => handleProductSelect(product._id)} className={`product-grid-item ${selectedProductId === product._id ? 'selected' : ''}`}>
              <div className="product-card">
                <img src={product.URLimage} alt={product.name} className="product-image" />
                <div className="product-name">{product.name}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!selectedProductId}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FeaturedProductFormModal;

