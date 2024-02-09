import React, { useState } from 'react';
import Table from 'react-bootstrap/Table'; // Import Table from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import Button from react-bootstrap

interface TableProps {
  data: any[];
  columns: { key: string; label: string }[];
  onSelectionChange?: (selectedItems: any[]) => void;
  onEdit: (item: any) => void; // Add this line
}

const CustomTable: React.FC<TableProps> = ({ data, columns, onSelectionChange, onEdit }) => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Adjust items per page as needed

  const handleSelectItem = (item: any, isChecked: boolean) => {
    if (isChecked) {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item]);
    } else {
      setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((selectedItem) => selectedItem !== item));
    }
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  };

  const sortItems = (items: any[]) => {
    if (!sortConfig) return items;
    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction: direction as 'ascending' | 'descending' });
  };

  const renderSortIndicator = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
  };

  const sortedItems = sortItems(data);
  const totalItems = sortedItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedItems.slice(startIndex, endIndex);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Select</th> {/* Add a header for selection */}
            {columns.map((column) => (
              <th key={column.key} onClick={() => handleSort(column.key)}>
                {column.label}{renderSortIndicator(column.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={(e) => handleSelectItem(item, e.target.checked)}
                />
              </td>
              {columns.map((column) => (
                <td key={column.key}>{item[column.key]}</td>
              ))}
              <td>
                <Button onClick={() => onEdit(item)}>Edit</Button> {/* Add this button */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        <Button onClick={goToPreviousPage} disabled={currentPage === 1} variant="primary">Previous</Button>
        <span> Page {currentPage} of {totalPages} </span>
        <Button onClick={goToNextPage} disabled={currentPage === totalPages} variant="primary">Next</Button>
      </div>
    </>
  );
};

export default CustomTable;