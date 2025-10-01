import React, { useState } from 'react';
import '../css/Filter.css';

const Filter = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    taskType: true,
    qaQm: false,
    qp: false,
    cspm: false,
    ordLot: false,
    trial: false,
    needByDate: true,
    requestDate: true
  });
  // dropdown component
 const FilterDropdown = ({ title, hasFilterWith = true, hasFilterExcept = false }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [inputText, setInputText] = useState('');
  const [inputHistory, setInputHistory] = useState([]);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);
  }
   
  const handleInputSubmit = () => {
    // Add to history if not empty and not already in the array
    if (inputText && !inputHistory.includes(inputText)) {
      setInputHistory([...inputHistory, inputText]);
    }
  }

    // Function to handle form submission
    const handleSubmit = () => {
      console.log({
        filterType: title,
        selectedValue,
        inputText
      });
    };

    return (
      <div className="filter-dropdown">
        <h2 className="filter-title">{title}</h2>
        <div className="filter-row">
          {hasFilterWith && (
            <div className="filter-column">
              <p className="filter-label">Filter List with Selection</p>
              <div className="select-container">
                <select className="filter-select">
                  <option value="">  </option>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </select>
              </div>
            </div>
          )} 
          {hasFilterExcept && (
            <div className="filter-column">
              <p className="filter-label">Filter except Selection</p>
              <select className="filter-select">
                <option value="">  </option>
              {inputHistory.map((item, index) => (
             <option key={index} value={item}>{item}</option> ))}
              </select>
            </div>
          )}
        </div>
        <div className="button-row">
          <button className="btn-cancel">Cancel</button>
          <button className="btn-ok" onClick={handleSubmit}>Ok</button>
        </div>
      </div>
    );
  };
  
  // Date filter component
  const DateFilter = ({ title }) => {
    return (
      <div className="filter-dropdown">
        <h2 className="filter-title">{title}</h2> 
        <div className="date-inputs">
          <div className="date-column">
            <p className="filter-label">From</p>
            <div className="date-input-group">
              <input type="date" className="date-input" /> 
            </div>
          </div>
          
          <div className="date-column">
            <p className="filter-label">To</p>
            <div className="date-input-group">
              <input type="date" className="date-input" />
            </div>
          </div>
        </div>
        
        <div className="date-shortcuts">
          <button className="shortcut-button">Today</button>
          <button className="shortcut-button">This Week</button>
          <button className="shortcut-button">This Month</button>
        </div>
        
        <div className="button-row">
          <button className="btn-cancel">Cancel</button>
          <button className="btn-ok">Ok</button>
        </div>
      </div>
    );
  };

  // Filter toggle button
  const FilterToggle = ({ label, checked, onChange }) => (
    <label className="filter-toggle">
      <input type="radio"
        className="toggle-radio"
        checked={checked}
        onChange={onChange}
      />
      <span className="toggle-label">{label}</span>
    </label>
  );

  return (
    <div className="filter-container">
      {/* Header with buttons and logo */}
      <div className="header">
        <div className="header-buttons">
          <button className="header-button">
            <span className="button-text">weiter Filter</span>
          </button>
          
          <button className="header-button">
            <span className="button-text">Start Search</span>
          </button>
          
          <button className="header-button">
            <span className="button-text">Delete Filter</span>
          </button>
        </div>
      </div>
      
      {/* First row of filter dropdowns */}
      <div className="filter-row-container">
        <FilterDropdown title="Task ID" hasFilterExcept={false} />
        <FilterDropdown title="Task type" hasFilterExcept={true} />
        <FilterDropdown title="Prio" hasFilterExcept={false} />
      </div>
      
      {/* Second row of filter dropdowns */}
      <div className="filter-row-container">
        <FilterDropdown title="QA/QM_Filter" hasFilterExcept={true} />
        <FilterDropdown title="QP_Filter" hasFilterExcept={true} />
      </div>
      
      {/* Third row of filter dropdowns */}
      <div className="filter-row-container">
        <FilterDropdown title="CSPM_Filter" hasFilterExcept={true} />
        <FilterDropdown title="OrdLot_Filter" hasFilterExcept={true} />
      </div>
      
      {/* Bottom row with date filters and TRIAL filter */}
      <div className="filter-row-container three-column">
        <DateFilter title="Need By Date" />
        <DateFilter title="Request Date" />
        <FilterDropdown title="TRIAL_Filter" hasFilterExcept={true} />
      </div>
    </div>
  );
};
export default Filter;
