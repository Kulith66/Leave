import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaveBalance = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState([]);
  const [balances, setBalances] = useState([]);
  const [message, setMessage] = useState("");
  const [leaveBalances, setLeaveBalances] = useState([]);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/adminLeave/get-leavetypes"
        );
        setLeaveTypes(response.data.data);
      } catch (error) {
        console.error("Error fetching leave types:", error);
      }
    };

    const fetchLeaveBalances = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/adminLeave/get-all-employee-leave-balances"
        );
        setLeaveBalances(response.data.data);
      } catch (error) {
        console.error("Error fetching leave balances:", error);
      }
    };

    fetchLeaveTypes();
    fetchLeaveBalances();
  }, []);

  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const handleLeaveTypeChange = (e, leaveTypeId) => {
    const updatedSelectedLeaveTypes = [...selectedLeaveTypes];
    const index = updatedSelectedLeaveTypes.indexOf(leaveTypeId);

    if (index > -1) {
      updatedSelectedLeaveTypes.splice(index, 1);
    } else {
      updatedSelectedLeaveTypes.push(leaveTypeId);
    }

    setSelectedLeaveTypes(updatedSelectedLeaveTypes);
  };

  const handleBalanceChange = (e, leaveTypeId) => {
    const updatedBalances = [...balances];
    const index = updatedBalances.findIndex((item) => item.leaveType === leaveTypeId);

    if (index > -1) {
      updatedBalances[index].balance = e.target.value;
    } else {
      updatedBalances.push({ leaveType: leaveTypeId, balance: e.target.value });
    }

    setBalances(updatedBalances);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId) {
      setMessage("Employee ID is required.");
      return;
    }

    if (selectedLeaveTypes.length === 0) {
      setMessage("Please select at least one leave type.");
      return;
    }

    if (balances.length !== selectedLeaveTypes.length) {
      setMessage("Please enter balances for all selected leave types.");
      return;
    }

    const data = { employeeId, leaveTypeIds: selectedLeaveTypes, balances: balances.map((b) => b.balance) };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/adminLeave/leave-balance",
        data
      );
      setMessage("Leave balance created successfully!");
      setLeaveBalances((prev) => [...prev, response.data.data]);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create leave balance.");
    }
  };

  return (
    <div>
      <h2>Create Leave Balance</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee ID:</label>
          <input
            type="text"
            value={employeeId}
            onChange={handleEmployeeIdChange}
            required
          />
        </div>
        <h3>Select Leave Types and Set Balances</h3>
        <div>
          {leaveTypes.map((leaveType) => (
            <div key={leaveType._id}>
              <input
                type="checkbox"
                id={leaveType._id}
                onChange={(e) => handleLeaveTypeChange(e, leaveType._id)}
              />
              <label htmlFor={leaveType._id}>{leaveType.type}</label>
              {selectedLeaveTypes.includes(leaveType._id) && (
                <input
                  type="number"
                  placeholder="Enter balance"
                  onChange={(e) => handleBalanceChange(e, leaveType._id)}
                  required
                />
              )}
            </div>
          ))}
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}

      <h2>Existing Leave Balances</h2>
      {leaveBalances.length > 0 ? (
        leaveBalances.map((balance) => (
          <div key={balance._id}>
            <h3>Employee ID: {balance.employeeId}</h3>
            <ul>
              {balance.leaveBalances.map((leave) => (
                <li key={`${balance._id}-${leave.leaveType._id}`}>
                  <strong>{leave.leaveType.type}</strong>: {leave.balance} (available: {leave.available})
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No leave balances found.</p>
      )}
    </div>
  );
};

export default LeaveBalance;
