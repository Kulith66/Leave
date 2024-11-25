import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateDuration = () => {
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    rate: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [leavePeriods, setLeavePeriods] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.startTime >= formData.endTime) {
      setMessage("Start time must be earlier than end time.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/adminLeave/create-leavePeriod",
        formData
      );
      setMessage("Leave period created successfully!");
      fetchLeavePeriods(); // Refresh leave periods
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create leave period.");
    }
  };

  const fetchLeavePeriods = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/adminLeave/get-leavePeriod");
      setLeavePeriods(response.data.data);
    } catch (error) {
      console.error("Error fetching leave periods:", error);
    }
  };

  useEffect(() => {
    fetchLeavePeriods();
  }, []);

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  return (
    <div>
      <h2>Create Duration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Duration Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rate:</label>
          <input
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Start Time:</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
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

      <h3>Leave Periods</h3>
      <ul>
        {leavePeriods.length > 0 ? (
          leavePeriods.map((leavePeriod) => (
            <li key={leavePeriod._id}>
              <strong>{leavePeriod.name}</strong>: {formatTime(leavePeriod.startTime)} - {formatTime(leavePeriod.endTime)} - {leavePeriod.description}
            </li>
          ))
        ) : (
          <p>No leave periods available.</p>
        )}
      </ul>
    </div>
  );
};

export default CreateDuration;
