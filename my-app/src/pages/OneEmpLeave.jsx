import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const OneEmpLeave = () => {
  const { employeeId } = useParams(); // Extract employeeId from the URL
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leave data
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/leave/OneEmpAll/${employeeId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const { data } = await response.json();

        // Sort leaves by startDate (earliest first)
        const sortedLeaves = data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        setLeaves(sortedLeaves);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [employeeId]);

  // Navigate to leave view page with the leave ID as a parameter
  const handleNavigateView = (leaveId) => {
    <OneEmpLeave/>
    navigate(`/leaveView/${leaveId}`);
  };

  // Render
  if (loading) return <p style={{ color: 'blue' }}>Loading leave data...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Leave List for Employee ID: {employeeId}</h2>
      {leaves && leaves.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Employee ID</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Type</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Period</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Start Date</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>End Date</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Description</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Paid</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{leave.employeeId}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{leave.leaveTypeName || 'N/A'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{leave.leavePeriodName || 'N/A'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{leave.description}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{leave.status}</td>
                <td
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    color: leave.paid ? 'green' : 'red',
                  }}
                >
                  {leave.paid ? 'Yes' : 'No'}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <button onClick={() => handleNavigateView(leave._id)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No leave records found. You can add a new leave by clicking "Add Leave".</p>
      )}
    </div>
  );
};

export default OneEmpLeave;
