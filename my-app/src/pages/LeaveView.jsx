import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const LeaveView = () => {
  const { leaveId } = useParams(); // Get leaveId from the URL
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/leave/getLeave/${leaveId}`);
        setLeave(response.data.data);  // The leave data is nested under "data"
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeave();
  }, [leaveId]);

  // Handle Approve
  const handleApprove = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/adminLeave/approve/${leaveId}`);
      setLeave((prevLeave) => ({
        ...prevLeave,
        status: 'approved',
      }));
      navigate("/"); // Navigate to homepage after approval
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  // Handle Reject
  const handleReject = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/adminLeave/reject/${leaveId}`);
      setLeave((prevLeave) => ({
        ...prevLeave,
        status: 'rejected',
      }));
      navigate("/"); // Navigate to homepage after rejection
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  if (loading) return <p>Loading leave details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Leave Details</h2>
      {leave && (
        <div>
          <p><strong>Employee ID:</strong> {leave.employeeId}</p>
          <p><strong>Type:</strong> {leave.leaveTypeName}</p>
          <p><strong>Period:</strong> {leave.leavePeriodName}</p>
          <p><strong>Start Date:</strong> {new Date(leave.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(leave.endDate).toLocaleDateString()}</p>
          <p><strong>Description:</strong> {leave.description}</p>
          <p><strong>Status:</strong> {leave.status}</p>

          {/* Approve/Reject buttons */}
          <button onClick={handleApprove} style={{ marginRight: '8px' }}>Approve</button>
          <button onClick={handleReject}>Reject</button>
        </div>
      )}
    </div>
  );
};

export default LeaveView;
