import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import '../css/1.css';

export default function Home() {
  const [taskId, setTaskId] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);

  const handleOk = async () => {
    if (!taskId) return alert('Bitte Task-ID eingeben');
    setLoading(true);
    try {
     
      const res = await fetch(`http://localhost:5000/taskid_table?taskId=${taskId}`);
      if (!res.ok) throw new Error('Tasks nicht gefunden');
      const data = await res.json();


     const dialogElement = document.querySelector('.dialog-box1');
    if (dialogElement) {
      dialogElement.style.display = 'none';
    }
      setTaskList(data); 
      setTaskData(data[0]); 
    } catch (e) {
      alert(e.message);
      setTaskList([]);
      setTaskData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTaskId('');
    setTaskList([]);
    setTaskData(null);
    setSelectedTaskIndex(null);
  };

  const handleTaskSelect = (index) => {
    setSelectedTaskIndex(index);
    setTaskData(taskList[index]);
  };


  const visibleColumns = ['TASKID', 'NEEDBYDATE','TRIAL','SUPPLY', 'PROGRAM', 'BULKLOTNO', 'ORDLOT'];
  // Funktion zur Anzeige des Zelleninhalts
  const CellContent = (content) => {
    
    return content ;
  };












  

  return (
    <div>
      {/* ——— Kopfzeile ——— */}
      <div className="home-icon">
        <FontAwesomeIcon icon={faHome} />
        <div className="HOME-text">HOME</div>
      </div>
      <div className="user-container">
        <div className="user-icon"><FontAwesomeIcon icon={faUser} /></div>
        <div className="user-text">USER</div>
      </div>
      <div className="abbvie-logo">abbvie</div>
      <div className="header1"><h2>WELCOME TO QPSD SYSTEM</h2></div>

      {/* ——— Task-ID-Dialog ——— */}
      <div className="dialog-box1">
        <div className="dialog-title">Task ID</div>
        <div className="dialog-divider" />
        <div className="dialog-sub">Filter List with Selection</div>
        <input 
          type="text"
          className="dialog-input"
          placeholder="Please enter."
          value={taskId}
          onChange={e => setTaskId(e.target.value)} 
          
        />
        <select className="dialog-select">
          <option value=""></option>
          <option value="1"></option>
          <option value="2"></option>
          <option value="3"></option>
        </select> 
        <div className="dialog-actions">
          <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
          <button className="btn-ok" onClick={handleOk}>Ok</button>
        </div>
      </div>

      {/* ——— Ladeanzeige ——— */}
      {loading && <p>Lade …</p>}

      {/* ——— Task-Liste (wenn taskList nicht leer ist) ——— */}
      {taskList.length > 0 && (
        <div className="task-list-container">
          <h2>Tasks mit ID: {taskId}</h2>
          <table>
            <thead>
              <tr>
                {visibleColumns.map(col => <th key={col}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {taskList.map((row, idx) => (
                <tr 
                  key={idx} 
                  className={selectedTaskIndex === idx ? 'selected' : ''}
                  onClick={() => handleTaskSelect(idx)}
                >
                  {visibleColumns.map((col, colIdx) => {
                    // Bestimme den Schlüssel basierend auf der Spaltenbeschriftung
                    const key=col.toUpperCase().replace(/-/g, '_').replace(/ /g, '_');
                    return (
                      <td key={col} style={{ whiteSpace: 'pre-line' }}>
                        {colIdx === 0 && '▶ '}
                        {CellContent(row[key])}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ——— Detail-Bereich (nur wenn taskData da ist) ——— */}
      {taskData && (
        <div className="task-details">
          <h2>Task Details</h2>
          <div className="row"><label>Task ID</label><input readOnly value={taskData.id} /></div>
          <div className="row"><label>Priority</label><input readOnly value={taskData.priority} /></div>
          <div className="row"><label>Need-by Date</label><input readOnly value={taskData.date} /></div>
          <div className="row"><label>Supply Code</label><input readOnly value={taskData.supply_code} /></div>
          <div className="row"><label>Program</label><input readOnly value={taskData.program} /></div>
          <div className="row"><label>Trial</label><input readOnly value={taskData.trial} /></div>
          <div className="row"><label>Requestor</label><input readOnly value={taskData.requestor} /></div>
          <div className="row"><label>CSPM</label><input readOnly value={taskData.cspm} /></div>
          <div className="row"><label>Task Type</label><input readOnly value={taskData.task_type} /></div>
          <div className="row long"><label>Description</label><textarea readOnly value={taskData.description} /></div>
          <div className="row long"><label>Bulk Lot No</label><textarea readOnly value={taskData.bulk_lot_no} /></div>
          <div className="row"><label>Orderable Lot</label><input readOnly value={taskData.orderable_lot} /></div>
          
      
        </div>
      )}
    </div>
  );
}
