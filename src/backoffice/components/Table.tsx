import React, { useState } from 'react'
import Table from 'react-bootstrap/Table' // Import Table from react-bootstrap
import Button from 'react-bootstrap/Button' // Import Button from react-bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

interface TableProps<T> {
  data: T[]
  columns: { key: keyof T; label: string }[]
  onSelectionChange?: (selectedItems: T[]) => void
  onEdit?: (item: T) => void
  children?: React.ReactNode
}

const CustomTable: React.FC<TableProps<any>> = ({
  data,
  columns,
  onSelectionChange,
  onEdit, // Destructure onEdit here
  children,
}) => {
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSelectItem = (item: any, isChecked: boolean) => {
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
                  <th key={column.key as string}>{column.label}</th>
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
                    <td key={column.key as string}>{item[column.key]}</td>
                  ))}
                  <td>
                    {children}
                    {onEdit && (
                      <Button onClick={() => onEdit(item)}>Edit</Button> // Add an Edit button
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
