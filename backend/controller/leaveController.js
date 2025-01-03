import mongoose from 'mongoose';  // Ensure mongoose is imported
import Balance from "../models/balance.js";
import Period from "../models/leavePeriod.js";
import Leave from "../models/leave.js";  // Ensure Leave model is imported
import Type from '../models/leavetypes.js';

export const addLeave = async (req, res) => {
    const { employeeId } = req.params;
    const { leaveType, leavePeriod, startDate, endDate, description, status } = req.body;
  
    try {
      console.log("Received request:", { employeeId, leaveType, leavePeriod, startDate, endDate, status });
  
      // Fetch leave type and period details
      const leaveTypeD = await Type.findById(leaveType);
      if (!leaveTypeD) {
        return res.status(404).send({ success: false, message: "Leave type not found" });
      }
  
      const leavePeriodD = await Period.findById(leavePeriod);
      if (!leavePeriodD) {
        return res.status(404).send({ success: false, message: "Leave period not found" });
      }
  
      const leaveTypeName = leaveTypeD.type;
      const leavePeriodName = leavePeriodD.name;
  
      // Validate and parse dates
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        return res.status(400).send({ success: false, message: "Invalid date format" });
      }
  
      // Validate leavePeriod as an ObjectId
      if (!mongoose.Types.ObjectId.isValid(leavePeriod)) {
        return res.status(400).send({ success: false, message: "Invalid leave period ID" });
      }
  
      // Calculate rate and duration
      const rate = leavePeriodD.rate;
      if (!rate) {
        return res.status(400).send({ success: false, message: "Leave period rate is missing" });
      }
  
      const { startTime, endTime } = leavePeriodD;
      let leaveDuration = calculateLeaveDuration(startTime, endTime);
      console.log("Calculated leave duration:", leaveDuration);
  
      // Fetch employee's leave balance
      const employeeBalance = await Balance.findOne({ employeeId });
      if (!employeeBalance) {
        return res.status(404).send({ success: false, message: "Employee not found" });
      }
  
      const leaveBalance = employeeBalance.leaveBalances.find(
        (balance) => String(balance.leaveType) === String(leaveType)
      );
  
      // Handle insufficient balance case
      let paid = true;
      if (!leaveBalance || leaveBalance.available < rate) {
        paid = false;
      } else {
        // Deduct leave balance
        leaveBalance.available -= rate;
        await employeeBalance.save();
        console.log(`Updated leave balance for ${employeeId}: ${leaveBalance.available}`);
      }
  
      // Save leave record
      const leave = new Leave({
        employeeId,
        leaveType,
        leavePeriod,
        startDate,
        endDate,
        description,
        status,
        leaveTypeName,
        leavePeriodName,
        paid,
      });
  
      await leave.save();
      console.log("Leave saved successfully:", leave);
  
      const message = paid
        ? "Leave added successfully with payment."
        : "Leave added successfully as non-paid.";
      res.status(200).send({ success: true, message });
    } catch (error) {
      console.error("Error adding leave:", error);
      res.status(500).send({ success: false, message: "An error occurred" });
    }
  };
  
  // Helper Function to Calculate Leave Duration
  const calculateLeaveDuration = (startTime, endTime) => {
    if (startTime === "08:00" && endTime === "00:00") {
      return 1; // Full day leave
    }
  
    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);
    return endHour - startHour;
  };
  

export const oneEmployeeLeaveBalanceDetails = async (req, res) => {
    const { employeeId } = req.params;  // Use params to get employeeId from the URL
    try {
      // Find the employee leave balance based on employeeId
      const already = await Balance.findOne({ employeeId });
      
      if (!already) {
        return res.status(400).send({ success: false, message: "No details found for the given employee ID" });
      }
      
      // Send the successful response
      return res.status(200).send({ success: true, message: "Leave balance details fetched successfully", data: already });
  
    } catch (error) {
      console.error(error);
      return res.status(400).send({ success: false, message: error.message });
    }
  };
  
export const OneleaveDetails = async(req, res) => {
    const { leaveId } = req.params;
    try {
        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return res.status(404).send({ success: false, message: "Leave not found" });
        }
        res.status(200).send({ success: true, data: leave });
    } catch (error) {
        console.error("Error fetching leave details:", error);
        res.status(500).send({ success: false, message: "Internal server error. Please try again later." });
    }
}

export const oneEmployeeAllLeaveDetails = async (req, res) => {
    const { employeeId } = req.params;

    try {
        // Find all leave records for the given employeeId
        const leaves = await Leave.find({ employeeId }).populate('leaveType leavePeriod', 'type name');

        // Check if no leave records are found
        if (!leaves || leaves.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No leave details found for the given employee ID",
            });
        }

        // Return success response with leave data
        res.status(200).send({
            success: true,
            data: leaves,
        });
    } catch (error) {
        // Handle and return any server errors
        console.error("Error retrieving leave details:", error);
        res.status(500).send({
            success: false,
            message: "An error occurred while fetching leave details",
        });
    }
};
