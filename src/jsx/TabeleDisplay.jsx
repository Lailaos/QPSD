import React, { useEffect, useState } from 'react';

function TableDisplay() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/table-data')
      .then(res => res.json())
      .then(data => setRows(data));
  }, []);

  if (rows.length === 0) return <div>Loading...</div>;

  const columns = Object.keys(rows[0]);

   return (
    <>
      <table>
        <thead>
          <tr>
            <th></th> {/* Kopfzelle für den Pfeil */}
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {/* Erste Spalte mit dem Pfeil */}
              <td>
                <button onClick={() => handleSelect(row)}>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </td>

              {/* Deine bestehenden Zellen */}
              {columns.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Optional: einfacher Detail-Block ohne Styling */}
      {selectedRow && (
        <div>
          <h3>Details</h3>
          <pre>{JSON.stringify(selectedRow, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

export default TableDisplay;
