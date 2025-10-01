import { Route,useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import '../css/1.css';
import QP from '../jsx/QP';

function Seite1() {
    const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/'); // Geht zur Startseite
  };
  return (
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
     <div className="abbvie-logo">abbvie</div>
 
      <div className="form-row-container">
        <div className="form-field-block">
          <div>
      <div className="dialog-title">Task ID</div>
        <div className="dialog-divider" />
      <input type="text" className="dialog-input" placeholder="Please enter." />
    </div>
    <div>
      <div className="dialog-title">Request Date</div>
      <input type="date" className="dialog-input" placeholder="Please enter." />
    </div>
        <div>
      <div className="dialog-title">Supply Code</div>
      <div className="dialog-divider" />
      <input type="text" className="dialog-input" placeholder="Please enter." />
    </div>

    <div className="form-row-container">
    <div className="form-field-block">
    <label className="dialog-title">Priority</label>
    <select className="dialog-input">
      <option value="">Bitte wählen</option>
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
    </div>
   </div>
   </div>
   </div>
   </div> 
 );
}
export default Seite1;
