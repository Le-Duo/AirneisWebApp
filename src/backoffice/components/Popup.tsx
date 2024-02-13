// Popup.tsx
import Modal, { ModalProps } from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

interface PopupProps extends ModalProps {
  show: boolean
  onHide: () => void
  title: string
  content: JSX.Element | string // Accept JSX.Element or string as content
}

const Popup: React.FC<PopupProps> = ({
  show,
  onHide,
  title,
  content,
  ...modalProps
}) => (
  <Modal show={show} onHide={onHide} {...modalProps}>
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
)

export default Popup
