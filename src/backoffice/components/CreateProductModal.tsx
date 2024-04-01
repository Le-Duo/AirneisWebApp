import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Product } from "../../types/Product";
import { Category } from "../../types/Category";
import { useCreateProductMutation } from "../../hooks/productHook";
import { useGetCategoriesQuery } from "../../hooks/categoryHook";

interface CreateProductModalProps {
  show: boolean;
  onHide: () => void;
  onProductCreate: () => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  show,
  onHide,
  onProductCreate,
}) => {
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    slug: "",
    URLimages: [''], 
    price: 0,
    description: "",
    materials: [],
    stock: 0,
    priority: false,
    category: {} as Category,
  });
  const { mutateAsync: createProduct } = useCreateProductMutation();
  const { data: categories } = useGetCategoriesQuery();

  const handleChange = (
    name: string,
    value: string | number | boolean | string[] | Category
  ) => {
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleURLChange = (value: string, index: number) => {
    const updatedURLs = [...newProduct.URLimages];
    updatedURLs[index] = value;
    setNewProduct((prev) => ({ ...prev, URLimages: updatedURLs }));
  };

  const addURLField = () => {
    setNewProduct((prev) => ({ ...prev, URLimages: [...prev.URLimages, ''] }));
  };

  const removeURLField = (index: number) => {
    const updatedURLs = [...newProduct.URLimages];
    updatedURLs.splice(index, 1);
    setNewProduct((prev) => ({ ...prev, URLimages: updatedURLs }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        categoryId: newProduct.category?._id,
      };
      await createProduct(productData);
      onProductCreate();
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Create Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newProduct.name}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              type="text"
              name="slug"
              value={newProduct.slug}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={newProduct.category?._id || ""}
              onChange={(e) =>
                handleChange(
                  "category",
                  categories?.find(
                    (category) => category._id === e.target.value
                  ) || ({} as Category)
                )
              }
            >
              <option>Select a category</option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL Images</Form.Label>
            {newProduct.URLimages.map((url, index) => (
              <div key={index} className="d-flex mb-2">
                <Form.Control
                  type="text"
                  value={url}
                  onChange={(e) => handleURLChange(e.target.value, index)}
                  className="me-2"
                />
                <Button variant="danger" onClick={() => removeURLField(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={addURLField}>Add Another Image URL</Button>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={newProduct.price}
              onChange={(e) =>
                handleChange(e.target.name, parseFloat(e.target.value))
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={newProduct.description}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Materials (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              name="materials"
              value={newProduct.materials.join(", ")}
              onChange={(e) =>
                handleChange(e.target.name, e.target.value.split(", "))
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={newProduct.stock}
              onChange={(e) =>
                handleChange(e.target.name, parseInt(e.target.value))
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={newProduct.priority ? "true" : "false"}
              onChange={(e) =>
                handleChange(e.target.name, e.target.value === "true")
              }
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Form.Select>
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

export default CreateProductModal;
