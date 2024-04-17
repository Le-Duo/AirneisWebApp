import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { CarouselItem } from "../../types/Carousel";
import { useCreateCarouselItemMutation } from "../../hooks/carouselHook";

interface CreateCarouselModalProps {
  show: boolean;
  onHide: () => void;
  onCarouselItemCreate: () => void;
}

const CreateCarouselModal: React.FC<CreateCarouselModalProps> = ({
  show,
  onHide,
  onCarouselItemCreate,
}) => {
  const [newCarouselItem, setNewCarouselItem] = useState<Partial<CarouselItem>>({
    src: "",
    alt: "",
    caption: "",
  });
  const { mutateAsync: createCarouselItem } = useCreateCarouselItemMutation();

  const handleChange = (name: string, value: string) => {
    setNewCarouselItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCarouselItem(newCarouselItem);
      onCarouselItemCreate();
    } catch (error) {
      console.error("Error creating carousel item:", error);
    } finally {
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Create Carousel Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Image Source (URL)</Form.Label>
            <Form.Control
              type="text"
              name="src"
              value={newCarouselItem.src}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Alt Text</Form.Label>
            <Form.Control
              type="text"
              name="alt"
              value={newCarouselItem.alt}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              as="textarea"
              name="caption"
              value={newCarouselItem.caption || ''}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateCarouselModal;