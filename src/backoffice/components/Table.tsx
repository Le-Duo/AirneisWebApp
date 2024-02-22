import React, { useState } from 'react'
import { Table, Button, Container, Row, Col } from 'react-bootstrap'

interface Column<T> {
  key: keyof T
  label: string
  renderer?: (item: T) => React.ReactNode
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  onSelectionChange?: (selectedItems: T[]) => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  children?: React.ReactNode
}

function CustomTable<T>({
  data,
  columns,
  onSelectionChange,
  onEdit,
  onDelete,
  children,
}: TableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<T[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSelectItem = (item: T, isChecked: boolean) => {
    setSelectedItems((prev) =>
      isChecked
        ? [...prev, item]
        : prev.filter((selectedItem) => selectedItem !== item)
    )
    onSelectionChange?.(selectedItems)
  }

  const paginatedItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <Container fluid>
      <Row className="mb-2">
        <Col>
          <Button
            className="m-1"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </Button>
          <Button
            className="m-1"
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(p + 1, Math.ceil(data.length / itemsPerPage))
              )
            }
          >
            Next
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Select</th>
                {columns.map((column) => (
                  <th key={String(column.key)}>{column.label}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item)}
                      onChange={(e) => handleSelectItem(item, e.target.checked)}
                    />
                  </td>
                  {columns.map((column) => (
                    <td key={String(column.key)}>
                      {column.renderer ? column.renderer(item) : String(item[column.key])}
                    </td>
                  ))}
                  <td>
                    {children}
                    {onEdit && (
                      <Button onClick={() => onEdit(item)}>Edit</Button>
                    )}
                    {onDelete && (
                      <Button variant="danger" onClick={() => onDelete(item)}>Delete</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Button
            className="m-1"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </Button>
          <Button
            className="m-1"
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(p + 1, Math.ceil(data.length / itemsPerPage))
              )
            }
          >
            Next
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default CustomTable

