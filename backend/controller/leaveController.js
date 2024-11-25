import mongoose from 'mongoose';  // Ensure mongoose is imported
import Balance from "../models/balance.js";
import Period from "../models/leavePeriod.js";
import Leave from "../models/leave.js";  // Ensure Leave model is imported
import Type from '../models/leavetypes.js';

export const addLeave = async (req, res) => {
    const { employeeId } = req.params;
    const { leaveType, leavePeriod, startDate, endDate, description,status } = req.body;

    try {
        console.log("Received request:", { employeeId, leaveType, leavePeriod, startDate, endDate,status });

        const leaveTypeD = await Type.findById(leaveType)
        const leaveTypeName = leaveTypeD.type
        const leavePeriodD = await Period.findById(leavePeriod)
        const leavePeriodName = leavePeriodD.name

        // Validate and parse startDate and endDate
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            return res.status(400).send({ success: false, message: "Invalid date format" });
        }

        // Ensure leavePeriod is an ObjectId
        if (!mongoose.Types.ObjectId.isValid(leavePeriod)) {
            return res.status(400).send({ success: false, message: "Invalid leave period ID" });
        }

        // Fetch rate for the leave period (use ObjectId for leavePeriod)
        const rateDetails = await Period.findById(leavePeriod);
        if (!rateDetails) {
            console.error("Period not found for:", { leavePeriod });
            return res.status(400).send({ success: false, message: "Invalid leave period or rate not found" });
        }

        const rate = rateDetails.rate;
        if (!rate) {
            console.error("Rate not found for leave period:", leavePeriod);
            return res.status(400).send({ success: false, message: "Leave period rate is missing" });
        }
        console.log("Rate found:", rate);

        // Handle time period logic (startTime, endTime)
        const { startTime, endTime } = rateDetails;

        // If endTime is 00:00, assume it's a full-day leave (24 hours)
        let leaveDuration = 0;
        if (endTime === "00:00" && startTime === "08:00") {
            leaveDuration = 1; // Full day (24 hours)
        } else {
            const startHour = parseInt(startTime.split(":")[0]);
            const endHour = parseInt(endTime.split(":")[0]);

            leaveDuration = endHour - startHour; // Duration in hours
        }

        console.log("Calculated leave duration:", leaveDuration);

        // Fetch employee leave balance for the leave type
        const employeeBalance = await Balance.findOne({ employeeId });
        if (!employeeBalance) {
            return res.status(404).send({ success: false, message: "Employee not found" });
        }

        const leaveBalance = employeeBalance.leaveBalances.find(
            (available) => String(available.leaveType) === String(leaveType)
        );

        if (!leaveBalance || isNaN(leaveBalance.available) || leaveBalance.available <= 0) {
            console.error("Invalid leave balance or insufficient balance:", leaveBalance);
            return res.status(400).send({ success: false, message: "Insufficient balance" });
        }

        // Check if there is enough balance to take leave
        if (leaveBalance.available < rate ){
            return res.status(400).send({ success: false, message: "Not enough leave balance for this period" });
        }

        // Deduct leave balance based on leaveDuration
        const newBalance = leaveBalance.available - rate;

        // Ensure new balance is a valid number
        if (isNaN(newBalance) || newBalance < 0) {
            return res.status(400).send({ success: false, message: "Invalid balance after deduction" });
        }

        // Update the employee's leave balance
        leaveBalance.available = newBalance;
        await employeeBalance.save();

        console.log(`Leave balance updated for employee ${employeeId}, new balance: ${newBalance}`);

        // Save the leave request
        const leave = new Leave({
            employeeId,
            leaveType,
            leavePeriod,
            startDate,
            endDate,
            description,
            status,
            leaveTypeName,
            leavePeriodName
        });

        await leave.save();

        console.log("Leave saved successfully:", leave);

        res.status(200).send({ success: true, message: "Leave added successfully" });
    } catch (error) {
        console.error("Error adding leave:", error);
        res.status(400).send({ success: false, message: "An error occurred" });
    }
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
        const leaves = await Leave.find({ employeeId: employeeId });  // Find leaves by employeeId
        if (!leaves || leaves.length === 0) {  // Check if no leaves were found
            return res.status(404).send({ success: false, message: "No leave details found for the given employee ID" });
        }
        res.status(200).send({ success: true, data: leaves });  // Return leaves data if found
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });  // Return error message if something goes wrong
    }
};
