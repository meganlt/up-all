import React, { useState } from 'react';
import './ManagerDashEmpTabs.css'; // Ensure this CSS file is correctly linked

const ManagerDashEmpTabs = () => {
  // Placeholder employee names
  const employees = ['Employee 1', 'Employee 2', 'Employee 3'];

  // State to track the selected employee and active tab
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]);
  const [activeTab, setActiveTab] = useState('Weekly Content');

  return (
    <div className="dashboard-container">
      {/* Vertical Navigation for Employees */}
      <nav className="employee-nav">
        <ul>
          {employees.map((employee) => (
            <li
              key={employee}
              className={selectedEmployee === employee ? 'active' : ''}
              onClick={() => setSelectedEmployee(employee)}
            >
              {employee}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Horizontal Navigation Tabs */}
        <div className="tabs">
          {['Weekly Content', 'Weekly 1:1', 'OKRs'].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Display Area */}
        <div className="content-area">
          <h2>{selectedEmployee}'s {activeTab}</h2>
          <p>Content for {activeTab} will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashEmpTabs;
