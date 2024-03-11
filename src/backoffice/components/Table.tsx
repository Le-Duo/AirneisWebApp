import React, { useState, useEffect } from 'react'
import { Table, Button, Container, Row, Col } from 'react-bootstrap'
import { FaAnglesLeft, FaAngleLeft, FaAngleRight, FaAnglesRight } from 'react-icons/fa6'

export interface Column<T> {
  _id: string
  key: keyof T
  label: string
  renderer?: (item: T) => React.ReactNode
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  children?: React.ReactNode
}

interface PaginationProps {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, itemsPerPage, totalItems, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div>
      <Button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        <FaAnglesLeft />
      </Button>
      <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <FaAngleLeft />
      </Button>
      {pageNumbers.map(page => (
        <Button key={page} onClick={() => onPageChange(page)} active={currentPage === page}>
          {page}
        </Button>
      ))}
      <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <FaAngleRight />
      </Button>
      <Button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
        <FaAnglesRight />
      </Button>
    </div>
  )
}

function CustomTable<T>({ data = [], columns, onEdit, onDelete, children }: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState(data)
  const itemsPerPage = 10

  useEffect(() => {
    const search = searchTerm.toLowerCase()
    const filtered = data.filter(item =>
      columns.some(column => String(item[column.key]).toLowerCase().includes(search))
    )
    setFilteredData(filtered)
    setCurrentPage(1) // Reset to first page on new search
  }, [searchTerm, data, columns])

  const paginatedItems = filteredData.slice(
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
          <input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>
      <Row className='mb-2'>
        <Col>
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredData.length}
            onPageChange={handlePageChange}
          />
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
                    {onEdit && <Button onClick={() => onEdit(item)}>Edit</Button>}
                    {onDelete && (
                      <Button variant='danger' onClick={() => onDelete(item)}>
                        Delete
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
