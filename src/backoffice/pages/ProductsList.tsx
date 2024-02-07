import { useState, useMemo } from 'react'
import { Table } from 'react-bootstrap'
import { useGetProductsQuery } from '../../hooks/productHook'
import { useSortBy, useTable } from 'react-table'
import { Product } from '../../types/Product'
import { Row } from 'react-table'

const ProductsList = () => {
  const { data: products, error, isLoading } = useGetProductsQuery()

  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const columns = useMemo(
    () => [
      {
        Header: 'Select',
        accessor: 'select',
        Cell: ({ row }: { row: Row<Product> }) => (
          <input
            type="checkbox"
            checked={selectedProducts.includes(row.original._id)}
            onChange={() => handleSelectProduct(row.original._id)}
          />
        ),
      },
      {
        Header: 'ID',
        accessor: '_id',
      },
      {
        Header: 'Nom',
        accessor: 'name',
      },
      {
        Header: 'Slug',
        accessor: 'slug',
      },
      {
        Header: 'URLimage',
        accessor: 'URLimage',
      },
      {
        Header: 'Catégorie',
        accessor: 'category.name',
      },
      {
        Header: 'Prix',
        accessor: 'price',
      },
      {
        Header: 'Stock',
        accessor: 'stock',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
    ],
    [selectedProducts]
  )

  const data = useMemo(() => products || [], [products])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching products</div>

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  return (
    <div>
      <h2>Liste des Produits</h2>
      <Table striped bordered hover {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default ProductsList
