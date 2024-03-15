import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { User } from "../../types/User";
import { userSignupMutation } from "../../hooks/userHook";

interface CreateUserModalProps {
  show: boolean;
  onHide: () => void;
  onUserCreate: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  show,
  onHide,
  onUserCreate,
}) => {
  const [newUser, setNewUser] = useState<User>({
    _id: "",
    name: "",
    email: "",
    password: "",
    isAdmin: false,
    token: "",
  });
  const { mutateAsync: createUser } = userSignupMutation();

  const handleChange = (name: string, value: string | boolean) => {
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const generatePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    setNewUser((prev) => ({ ...prev, password }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      onUserCreate();
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Create User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newUser.name}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={newUser.email}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="me-3">Password</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                name="password"
                value={newUser.password}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="me-2" // Add margin to separate the Form.Control and Button
              />
              <Button variant="secondary" onClick={() => generatePassword()}>
                Generate
              </Button>
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Admin</Form.Label>
            <Form.Select
              name="isAdmin"
              value={newUser.isAdmin ? "true" : "false"}
              onChange={(e) =>
                handleChange(e.target.name, e.target.value === "true")
              }
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">
            Create User
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateUserModal;
