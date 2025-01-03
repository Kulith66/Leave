import React, { useState } from 'react';  // Import useState
import { useNavigate } from 'react-router';

const Charts = () => {
    const [employeeId, setEmployeeId] = useState('');  // Use state for employeeId
    const navigate = useNavigate();  // Initialize navigate

    // Function to handle the input change
    const handleEmployeeIdChange = (e) => {
        setEmployeeId(e.target.value);  // Update employeeId state on input change
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Navigate to chart view with dynamic employeeId
        navigate(`/chartView/${employeeId}`);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter Employee ID:</label>
                <input
                    type="text"
                    value={employeeId}
                    onChange={handleEmployeeIdChange}  // Update employeeId on input change
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Charts;
