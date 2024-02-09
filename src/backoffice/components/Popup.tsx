// Popup.tsx
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface PopupProps {
  show: boolean;
  onHide: () => void;
  title: string;
  content: JSX.Element | string; // Accept JSX.Element or string as content
}

const Popup: React.FC<PopupProps> = ({ show, onHide, title, content }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Popup;