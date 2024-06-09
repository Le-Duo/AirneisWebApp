import React, { useState } from 'react'
import { Table, Button, Container, Row, Col, Pagination } from 'react-bootstrap'
import { FaPlus, FaPen, FaTrash } from 'react-icons/fa6' 

export interface Column<T> {
  _id: string
  key: keyof T
  label: string
  renderer?: (item: T) => React.ReactNode
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  onAdd?: () => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  children?: React.ReactNode
}

function CustomTable<T>({ data = [], columns, onAdd, onEdit, onDelete, children }: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginatedItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <Container fluid>
      <Row className='mb-2'>
        <Col>
          {onAdd && (
            <Button variant="primary" onClick={onAdd} className="mb-3">
              <FaPlus />
            </Button>
          )}
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages).keys()].map(page => (
              <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
                {page + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                {columns.map(column => (
                  <th key={String(column.key)}>{column.label}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item, index) => (
                <tr key={index}>
                  {columns.map(column => (
                    <td key={String(column.key)}>
                      {column.renderer ? column.renderer(item) : String(item[column.key])}
                    </td>
                  ))}
                  <td>
                    {children}
                    {onEdit && <Button onClick={() => onEdit(item)}><FaPen /></Button>}
                    {onDelete && (
                      <Button variant='danger' onClick={() => onDelete(item)}>
                        <FaTrash />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )
}

export default CustomTable