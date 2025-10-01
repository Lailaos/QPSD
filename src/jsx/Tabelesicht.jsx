import { Route, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import {faHome, faUser,faArrowRight,faCopy,faInfoCircle ,faPlus, faTrash, faSortUp,faSortDown,faSort,faEdit} from '@fortawesome/free-solid-svg-icons';
import '../css/App.css';
import '../css/Table-new.css';
import '../css/home.css';


const columnDisplayNames = {
  'PRIO': 'PRIO',
  'NEEDBYDATE': 'Need By Date',
  'TRIAL': 'Trial',
  'TASKTYPE': 'Task Type',
  'CPSM': 'CPSM',
  'BULKLOTNO': 'Bulk Lot No.',
  'ORDLOT': 'Order Lot',
  'QE': 'QE',
  'QP': 'QP',
  'QEcomplete': 'QE Complete',
  'MP_CHECK': 'MP'
};


function Tabelesicht() {
  const [tableData, setTableData] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filterValue, setFilterValue] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingCell, setEditingCell] = useState({ rowIdx: null, colKey: null, value: '' });



// ZUM MORE DETAILS
const [detailsOpen, setDetailsOpen] = useState(false);
const [selectedTask, setSelectedTask] = useState(null);

//Update your handleShowDetails function to show the details on the left side
  const handleShowDetails = (row) => {
    setSelectedTask(row);
    setDetailsOpen(true);
  };

  // Add the formatCellContent function
    const CellContent = (content) => {
    if (!content) return '';
    const str = String(content);
    
    // Format the content with line breaks
    let result = '';
    for (let i = 0; i < str.length; i += 20) {
      result += str.substring(i, i + 12);
    }
    return result;
  };


  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
 

  // Get sorted data
  const getSortedData = () => {
    const filteredData = tableData.filter(item => {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(filterValue.toLowerCase())
      );
    });

 if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

 // Row selection handler
  const handleRowSelection = (idx) => {
    if (selectedRows.includes(idx)) {
      setSelectedRows(selectedRows.filter(rowIdx => rowIdx !== idx));
    } else {
      setSelectedRows([...selectedRows, idx]);
    }
  };
  
  // Cell editing handler
  const handleCellEdit = (rowIdx, colKey, value) => {
    setEditingCell({ rowIdx, colKey, value });
  };
 const saveEdit = () => {
    if (editingCell.rowIdx !== null) {
      const updatedData = [...tableData];
      updatedData[editingCell.rowIdx] = {
        ...updatedData[editingCell.rowIdx],
        [editingCell.colKey]: editingCell.value
      };
      setTableData(updatedData);
      setEditingCell({ rowIdx: null, colKey: null, value: '' });
    }
  };
  
  // Filter handler
  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };
// Add new row
  const addNewRow = () => {
    const newRow = {};
    visibleColumns.forEach(col => newRow[col] = '');
    setTableData([...tableData, newRow]);
  };

// Delete selected rows
  const deleteSelectedRows = () => {
    const updatedData = tableData.filter((_, idx) => !selectedRows.includes(idx));
    setTableData(updatedData);
    setSelectedRows([]);
  };
  
  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const sortedData = getSortedData();
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  
  // Pagination navigation
  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  return (
    <div className={`app-container ${detailsOpen ? 'with-details-open' : ''}`}>
      {detailsOpen && (
  <div className="task-details-panel">
    <div className="details-header">
      <h3>Task Details</h3>
      <button className="close-btn" onClick={() => setDetailsOpen(false)}>×</button>
    </div>
    <div className="details-content">
      <ul className="details-list">
        {selectedTask && Object.entries(selectedTask).map(([key, value]) => (
          <li key={key} className="detail-item">
            <strong>{columnDisplayNames[key] || key}:</strong> {value || '-'}
          </li>
        ))}         
      </ul>
    </div>
  </div>
)}  
    <div> 
       <div className="home-icon"> <FontAwesomeIcon icon={faHome} />
        <div className="HOME-text">HOME</div>
      </div>
   
     
         <div className="header2">
        <h2>WELCOME TO QPSD SYSTEM</h2>
      </div>
      <div className="row-btn">
        <button className="row-btn" onClick={() => {
          fetch('http://localhost:5000/qa_table')
            .then(res => res.json())
            .then(data => setTableData(data));
          setVisibleColumns(['PRIO', 'NEEDBYDATE','TRIAL','PROGRAM','TASKTYPE','TASKDESCRIPTION','CPSM','ORDLOT','QE','QP','QECOMPLETED']);
        }}>QA</button>
        
        <button className="row-btn" onClick={() => {
          fetch('http://localhost:5000/cspm_table')
            .then(res => res.json())
            .then(data => setTableData(data));
          setVisibleColumns(['PRIO','NEEDBYDATE','TRIAL','TASKTYPE','CPSM','BULKLOTNO','ORDLOT','QE','QP','QEcomplete','MP_CHECK']);
        }}>CSPM</button>

        <button className="row-btn" onClick={() => {
          fetch('http://localhost:5000/ceo_table')
            .then(res => res.json())
            .then(data => setTableData(data));
          setVisibleColumns(['TASKID', 'NEEDBYDATE','TRIAL','SUPPLY', 'PROGRAM', 'BULKLOTNO', 'ORDLOT']);
        }}>COE</button>


          <button className="row-btn" onClick={() => {
          fetch('http://localhost:5000/Schduling_table')
            .then(res => res.json())
            .then(data => setTableData(data));
          setVisibleColumns(['TASKID', 'NEEDBYDATE', 'SUPPLY', 'PROGRAM','TASKTYPE', 'BULKLOTNO','CPSM','ORDLOT','QEcomplete']);
        }}>Schduling</button>
         {/* Filter dropdown positioned inline with other buttons */}
  <select 
    className="row-btn dialog-select"
    onChange={(e) => {
      fetch('http://localhost:5000/qa_table')
        .then(res => res.json())
        .then(data => setTableData(data));
      setVisibleColumns(['taskid', 'prio', 'need by date', 'tasktype', 'program', 'bulklotNo']);
    }}
  >
            <option value="">Filter List with Selection</option>
            <option value="1">ALL Task</option>
            <option value="2">TO Do List</option>
            <option value="3">Approved</option>
            <option value="4">Rejected</option>
            <option value="5">Pending </option> </select>
        </div>
      

        {/* Table controls */}
      <div className="table-controls">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Global Search..." 
            value={filterValue} 
            onChange={handleFilterChange} 
            className="global-search" />
        </div>
        <div className="rows-per-page">
          <label>Rows per page:</label>
          <select 
            value={rowsPerPage} 
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}>
            <option value="20">20</option>  
            <option value="30">30</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

         <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Select</th>
              {visibleColumns.map(col => (
                <th key={col} onClick={() => requestSort(col)} className="sortable-header">
                  {columnDisplayNames[col] || col} 
                  {sortConfig.key === col ? (
                    <FontAwesomeIcon 
                      icon={sortConfig.direction === 'ascending' ? faSortUp : faSortDown}
                      className="sort-icon" 
                    />
                  ) : (
                    <FontAwesomeIcon icon={faSort} className="sort-icon" />
                  )}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, idx) => {
              const actualIdx = indexOfFirstRow + idx;
              return (
                <tr 
                  key={actualIdx} 
                  className={selectedRows.includes(actualIdx) ? 'selected-row' : ''}
                >
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedRows.includes(actualIdx)}
                      onChange={() => handleRowSelection(actualIdx)}
                    />
                  </td>
                  {visibleColumns.map((col) => (
                    <td key={col}>
                      {editingCell.rowIdx === actualIdx && editingCell.colKey === col ? (
                        <div className="edit-cell">
                          <input 
                            type="text" 
                            value={editingCell.value}
                            onChange={(e) => setEditingCell({...editingCell, value: e.target.value})}
                            onBlur={saveEdit}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div 
                          className="cell-content"
                          onDoubleClick={() => handleCellEdit(actualIdx, col, row[col] || '')}
                        >
                          {CellContent(row[col])}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="action-cell">
                    <button 
                      className="edit-btn" title="Edit Task"
                      onClick={() => handleCellEdit(actualIdx, visibleColumns[0], row[visibleColumns[0]] || '')} >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                     <button 
                      className="copy-btn"  title="Duplicate Task" // Hover-Text hinzufügen

                      onClick={() => {
                        const newRow = {...row};
                        const newData = [...tableData];
                        newData.splice(actualIdx + 1, 0, newRow);
                        setTableData(newData);
                      }}
                    >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                    <button 
                      className="details-btn" 
                      title="More Details"
                      onClick={() => {
                        // Implementierung der Details-Ansicht
                        setSelectedTask(row);
                        setDetailsOpen(true);
                        // Fetch additional details
                     fetch(`http://localhost:5000/more_detail/${row.TASKID}`)
                    .then(response => response.json())
                    .then(detailData => {
                      // Update with detailed information
                  setVisibleColumns(['TASKID', 'NEEDBYDATE', 'SUPPLY', 'PROGRAM','TASKTYPE', 'BULKLOTNO','CPSM','ORDLOT','QEcomplete']);

                      setSelectedTask(prevData => ({ ...prevData, ...detailData }));
                    })
                    .catch(error => console.error('Error fetching details:', error));
                      }}
                       >
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </button>

                    <button  
                      className="delete-btn"  title="Delete Task" // Hover-Text hinzufügen
                      onClick={() => {const newData = [...tableData];
                        newData.splice(actualIdx, 1);
                        setTableData(newData);  }}> <FontAwesomeIcon icon={faTrash} />
                     </button>
                    
                  </td>
                </tr> ); })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="pagination">
        <button 
          onClick={() => paginate(1)} 
          disabled={currentPage === 1}
          className="page-btn"
        >
          First
        </button>
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
          className="page-btn"
        >
          Prev
        </button>
        <div className="page-info">
          Page {currentPage} of {totalPages > 0 ? totalPages : 1}
        </div>
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === totalPages || totalPages === 0}
          className="page-btn"
        >
          Next
        </button>
        <button 
          onClick={() => paginate(totalPages)} 
          disabled={currentPage === totalPages || totalPages === 0}
          className="page-btn"
        >
          Last
        </button>
      </div>   
    </div>
    </div>

  );}
export default Tabelesicht;