import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, FormControl, Row, Col } from 'react-bootstrap'

const SearchBar = () => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?query=${search}`)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row noGutters>
        <Col md={10} className="p-0">
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={2} className="p-0">
          <Button type="submit" className="ml-md-0">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default SearchBar
