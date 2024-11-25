import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateLeave = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [leavePeriod, setLeavePeriod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');  // Default status
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leavePeriods, setLeavePeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch leave types and leave periods on component mount
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/adminLeave/get-leavetypes');
        setLeaveTypes(response.data); // Assuming the response contains leave types
      } catch (err) {
        setError("Failed to fetch leave types");
        console.error(err); // Log the error for debugging
      }
    };

    const fetchLeavePeriods = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/AdminLeave/get-leavePeriod');
        setLeavePeriods(response.data); // Assuming the response contains leave periods
      } catch (err) {
        setError("Failed to fetch leave periods");
        console.error(err); // Log the error for debugging
      }
    };

    fetchLeaveTypes();
    fetchLeavePeriods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate employeeId
    if (!employeeId) {
      setError("Employee ID is required");
      return;
    }

    setLoading(true);
    setError(null); // Clear any previous errors

    const leaveData = {
      employeeId,
      leaveType,
      leavePeriod,
      startDate,
      endDate,
      description,
      status,
    };

    try {
      const response = await axios.post(`http://localhost:5000/api/leave/addLeave/${employeeId}`, leaveData);
      setMessage(response.data.message); // Show success message
      // Reset form after successful submission
      setEmployeeId('');
      setLeaveType('');
      setLeavePeriod('');
      setStartDate('');
      setEndDate('');
      setDescription('');
      setStatus('Pending');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error submitting leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Request Leave</h1>

      {/* Leave Request Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee ID:</label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Leave Type:</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            required
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type.type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Leave Period:</label>
          <select
            value={leavePeriod}
            onChange={(e) => setLeavePeriod(e.target.value)}
            required
          >
            <option value="">Select Leave Period</option>
            {leavePeriods.map((period) => (
              <option key={period._id} value={period._id}>
                {period.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Leave Description"
          ></textarea>
        </div>

        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Leave Request'}
        </button>
      </form>

      {/* Error Handling */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Success Message */}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default CreateLeave;
