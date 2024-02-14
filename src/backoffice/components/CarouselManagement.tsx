import { useEffect, useState } from 'react'
import { Button, Form, Modal, Table } from 'react-bootstrap'

interface CarouselItem {
  _id?: string
  src: string
  alt: string
  caption: string
}

const CarouselManagement = () => {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [currentItem, setCurrentItem] = useState<CarouselItem>({
    src: '',
    alt: '',
    caption: '',
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchCarouselItems()
  }, [])

  const fetchCarouselItems = async () => {
    const response = await fetch('/api/carousel')
    const data = await response.json()
    setCarouselItems(data)
  }

  const handleSave = async () => {
    const method = isEditing ? 'PUT' : 'POST'
    const url = isEditing ? `/api/carousel/${currentItem._id}` : '/api/carousel'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentItem),
    })
    fetchCarouselItems()
    setShowModal(false)
  }

  const handleEdit = (item: CarouselItem) => {
    setCurrentItem(item)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleAdd = () => {
    setCurrentItem({ src: '', alt: '', caption: '' })
    setIsEditing(false)
    setShowModal(true)
  }

  return (
    <>
      <Button onClick={handleAdd}>Add New Item</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Image</th>
            <th>Alt Text</th>
            <th>Caption</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {carouselItems.map((item) => (
            <tr key={item._id}>
              <td>{item.src}</td>
              <td>{item.alt}</td>
              <td>{item.caption}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Edit Carousel Item' : 'Add Carousel Item'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Image Source</Form.Label>
              <Form.Control
                type="text"
                value={currentItem.src}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, src: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Alt Text</Form.Label>
              <Form.Control
                type="text"
                value={currentItem.alt}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, alt: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Caption</Form.Label>
              <Form.Control
                type="text"
                value={currentItem.caption}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, caption: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEditing ? 'Save Changes' : 'Add Item'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CarouselManagement
