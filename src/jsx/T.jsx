import React, { useState, useEffect } from 'react';
import '../css/Table.css';

const Table = () => {
  // Sample data
  const initialData = [
    { Prio: 1, name: 'John Doe', age: 28, email: 'john@example.com', status: 'Active' },
    { Prio: 2, name: 'Jane Smith', age: 32, email: 'jane@example.com', status: 'Inactive' },
    { Prio: 3, name: 'Bob Johnson', age: 45, email: 'bob@example.com', status: 'Active' },
    { Prio: 4, name: 'Alice Williams', age: 24, email: 'alice@example.com', status: 'Pending' },
    { Prio: 5, name: 'Charlie Brown', age: 37, email: 'charlie@example.com', status: 'Active' },
  ];

  // State management
  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingCell, setEditingCell] = useState({ rowId: null, field: null });
  const [editValue, setEditValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Column definitions
  const columns = [
    { key: 'Prio', label: 'Prio', sortable: true },
    { key: 'name', label: 'Name', sortable: true, editable: true },
    { key: 'age', label: 'Age', sortable: true, editable: true },
    { key: 'email', label: 'Email', sortable: true, editable: true },
    { key: 'status', label: 'Status', sortable: true, editable: true },
  ];

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Apply filters and search
  const filteredData = React.useMemo(() => {
    return sortedData.filter(row => {
      // Apply column filters
      for (const [key, value] of Object.entries(filters)) {
        if (value && !String(row[key]).toLowerCase().includes(value.toLowerCase())) {
          return false;
        }
      }
      
      // Apply global search
      if (searchTerm) {
        return Object.values(row).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    });
  }, [sortedData, filters, searchTerm]);

  // Pagination
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const pageCount = Math.ceil(filteredData.length / rowsPerPage);

  // Row selection handlers
  const handleSelectAllRows = (e) => {
    if (e.target.checked) {
      setSelectedRows(paginatedData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter(id => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  // Cell editing handlers
  const handleEditCell = (rowId, field, value) => {
    setEditingCell({ rowId, field });
    setEditValue(value);
  };

  const handleSaveEdit = () => {
    setData(data.map(row => 
      row.id === editingCell.rowId 
        ? { ...row, [editingCell.field]: editValue } 
        : row
    ));
    setEditingCell({ rowId: null, field: null });
  };

  const handleCancelEdit = () => {
    setEditingCell({ rowId: null, field: null });
  };

  // Filter change handler
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  // Add new row
  const handleAddRow = () => {
    const newId = Math.max(...data.map(row => row.id)) + 1;
    const newRow = { 
      id: newId,
      name: '',
      age: 0,
      email: '',
      status: 'Pending'
    };
    setData([...data, newRow]);
  };

  // Delete selected rows
  const handleDeleteSelected = () => {
    setData(data.filter(row => !selectedRows.includes(row.id)));
    setSelectedRows([]);
  };

  return (
    <div className="table-container">
      <div className="table-controls">
        <div className="table-search">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="table-actions">
          <button onClick={handleAddRow} className="add-button">Add Row</button>
          <button 
            onClick={handleDeleteSelected} 
            className="delete-button" 
            disabled={selectedRows.length === 0}
          >
            Delete Selected
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="react-table">
          <thead>
            <tr>
              <th className="select-cell">
                <input 
                  type="checkbox" 
                  onChange={handleSelectAllRows}
                  checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                />
              </th>
              {columns.map(column => (
                <th 
                  key={column.key}
                  className={column.sortable ? 'sortable' : ''}
                  onClick={() => column.sortable && requestSort(column.key)}
                >
                  <div className="column-header">
                    <span>{column.label}</span>
                    {sortConfig.key === column.key && (
                      <span className={`sort-icon ${sortConfig.direction}`}>
                        {sortConfig.direction === 'ascending' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
            <tr className="filter-row">
              <th></th>
              {columns.map(column => (
                <th key={`filter-${column.key}`}>
                  <input
                    type="text"
                    placeholder={`Filter ${column.label}`}
                    value={filters[column.key] || ''}
                    onChange={(e) => handleFilterChange(column.key, e.target.value)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map(row => (
                <tr 
                  key={row.id}
                  className={selectedRows.includes(row.id) ? 'selected' : ''}
                >
                  <td className="select-cell">
                    <input 
                      type="checkbox" 
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </td>
                  {columns.map(column => (
                    <td 
                      key={`${row.id}-${column.key}`}
                      className={column.editable ? 'editable' : ''}
                      onClick={() => column.editable && handleEditCell(row.id, column.key, row[column.key])}
                    >
                      {editingCell.rowId === row.id && editingCell.field === column.key ? (
                        <div className="edit-cell">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <div className="edit-actions">
                            <button onClick={handleSaveEdit}>✓</button>
                            <button onClick={handleCancelEdit}>✕</button>
                          </div>
                        </div>
                      ) : (
                        <span className={`status-${row.status?.toLowerCase()}`}>{row[column.key]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="no-data">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-pagination">
        <div className="rows-per-page">
          <span>Rows per page:</span>
          <select 
            value={rowsPerPage} 
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="pagination-controls">
          <button 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
          >
            «
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            ‹
          </button>
          
          <span className="pagination-info">
            Page {currentPage} of {pageCount || 1}
          </span>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))} 
            disabled={currentPage === pageCount || pageCount === 0}
          >
            ›
          </button>
          <button 
            onClick={() => setCurrentPage(pageCount)} 
            disabled={currentPage === pageCount || pageCount === 0}
          >
            »
          </button>
        </div>

        <div className="pagination-summary">
          Showing {filteredData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
        </div>
      </div>
    </div>
  );
};

export default Table;
