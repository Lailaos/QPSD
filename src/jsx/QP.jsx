// src/QP.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser} from '@fortawesome/free-solid-svg-icons';
import { Route,useNavigate } from 'react-router-dom';
import Seite1 from '../jsx/Seite1';
// State für Radiobutton-Auswahl (optional)
function QP() {
  const navigate = useNavigate();
  <Route path="/Seite1" element={<Seite1 />} />
const handleAddTaskClick = () => {
  navigate('/Seite1'); // z.B. '/add-task'
};
  const handleEditTaskClick = () => {
      navigate('/Seite2'); // z.B. '/edit-task'
  };
  const handleViewTaskClick = () => {
          navigate('/Tabelesicht'); // z.B. '/view-Tabele'
  };

   // Handler für das Home-Icon
   const handleHomeClick = () => {
          navigate('/Seite1')
   };

  const Filter = () => {
  navigate('/Filter');
};

  const T = () => {
  navigate('/T');
};


    return (
    <div>
    <div>
    <div className="home-icon" onClick={handleHomeClick}>  
    <FontAwesomeIcon icon={faHome} />
    <div className="HOME-text">HOME</div>
     </div>
      <div className="user-container">
        <div className="user-icon">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div className="user-text">USER</div>
        </div>
       <div className="logo-container">
          <img src="C:\Users\seffolx\qpsd\src\AbbVie.png" alt="AbbVie Logo" className="abbvie-logo" />
        </div>
      <div className="header2">
        <h2>WELCOME TO QPSD SYSTEM</h2>
      </div>
      <div className="selection-container">
      <div className="selection-title">Select What like to do</div>
      <div className="options">
   <button className="big-button" onClick={handleAddTaskClick}>Add Task</button>
   <button className="big-button" onClick={handleEditTaskClick}>Edit Task</button>
    <button className="big-button" onClick={handleViewTaskClick}>Task View</button>
    <button className="big-button" onClick={Filter}>Filter</button>
    <button className="big-button" onClick={T}>###</button>
  </div>
  </div>
  </div>
  </div>
  );
}
export default QP;
