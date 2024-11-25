import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateType = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    type: '',
    description: ''
  });

  // State for success or error messages
  const [message, setMessage] = useState('');

  // State for storing the list of leave types
  const [leaveTypes, setLeaveTypes] = useState([]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post(
        'http://localhost:5000/api/adminLeave/create-leavetypes',
        formData
      );
      setMessage('Leave type created successfully!');
      console.log('Response:', response.data);
      // After creating the leave type, fetch the updated list
      fetchLeaveTypes();
    } catch (error) {
      setMessage('Failed to create leave type. Please try again.');
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  // Fetch leave types from the API
  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/adminLeave/get-leavetypes');
      setLeaveTypes(response.data.data); // Update state with fetched leave types
    } catch (error) {
      console.error('Error fetching leave types:', error);
    }
  };

  // Fetch leave types when the component mounts
  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  return (
    <div>
      <h2>Create Type</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type Name:</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}

      <h3>Leave Types</h3>
      <ul>
        {leaveTypes.length > 0 ? (
          leaveTypes.map((leaveType) => (
            <li key={leaveType._id}>
              <strong>{leaveType.type}</strong>: {leaveType.description}
            </li>
          ))
        ) : (
          <p>No leave types available.</p>
        )}
      </ul>
    </div>
  );
};

export default CreateType;
