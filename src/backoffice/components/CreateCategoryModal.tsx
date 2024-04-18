import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Category } from "../../types/Category";
import { useCreateCategoryMutation } from "../../hooks/categoryHook";

interface CreateCategoryModalProps {
  show: boolean;
  onHide: () => void;
  onCategoryCreate: () => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  show,
  onHide,
  onCategoryCreate,
}) => {
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    description: "",
  });
  const { mutateAsync: createCategory } = useCreateCategoryMutation();

  const handleChange = (name: string, value: string) => {
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory(newCategory as Category);
      onCategoryCreate();
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Create Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newCategory.name}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              type="text"
              name="slug"
              value={newCategory.slug}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={newCategory.description || ''}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              name="urlImage"
              value={newCategory.urlImage}
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

export default CreateCategoryModal;
