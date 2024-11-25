import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

const AddLeave = () => {
  const [employeeId, setEmployeeId] = useState('');  // State to manage employeeId input
  const [leaveBalance, setLeaveBalance] = useState(null);  // State to store leave balance details
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);  // Error state

  const navigate = useNavigate();  // Initialize navigate

  // Handle employee ID change
  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading when the form is submitted

    try {
      const response = await axios.get(`http://localhost:5000/api/leave/getBalance/${employeeId}`);  // Fetch leave balance for the employee ID
      setLeaveBalance(response.data.data);  // Set the leave balance details
    } catch (err) {
      setError(err.message);  // Set error message if request fails
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  // Navigate to the employee's leave details page
  const handleNavigateAddLeave = () => {
    navigate(`/OneEmpLeave/${employeeId}`);  // Use navigate to route to the leave details page
  };

  return (
    <div>
      {/* Employee ID Input Form */}
      <form onSubmit={handleSubmit}>
        <label>Enter Employee ID:</label>
        <input
          type="text"
          value={employeeId}
          onChange={handleEmployeeIdChange}  // Update employeeId on input change
        />
        <button type="submit">Submit</button>
      </form>

      {/* Loading State */}
      {loading && <p>Loading leave balance details...</p>}

      {/* Error Handling */}
      {error && <p>Error: {error}</p>}

      {/* Display Leave Balance Details */}
      {leaveBalance && (
        <div>
          <h2>Employee Leave Balance</h2>
          <p><strong>Employee ID:</strong> {leaveBalance.employeeId}</p>
          <p><strong>Leave Types:</strong></p>
          <ul>
            {leaveBalance.leaveBalances.map((leaveBalanceItem, index) => (
              <li key={index}>
                <p><strong>Leave Type:</strong> {leaveBalanceItem.leaveType.name}</p>
                <p><strong>Balance:</strong> {leaveBalanceItem.balance}</p>
                <p><strong>Available:</strong> {leaveBalanceItem.available}</p>
              </li>
            ))}
          </ul>
          <button onClick={handleNavigateAddLeave}>View</button>  {/* View button to navigate to the leave details page */}
        </div>
      )}
    </div>
  );
};

export default AddLeave;
