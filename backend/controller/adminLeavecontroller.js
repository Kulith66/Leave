import Balance from "../models/balance.js";
import Leave from "../models/leave.js";
import Period from "../models/leavePeriod.js";
import Type from "../models/leavetypes.js";
// create leave type bY ADMIN
export const leaveTypes = async (req, res) => {
    const { type, description } = req.body;
  
    try {
      // Check if the leave type already exists
      const existing = await Type.findOne({ type }); // Use `findOne` instead of `find`
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Leave type already exists",
        });
      }
  
      // Create a new leave type
      const newType = new Type({ type, description });
      await newType.save();
  
      res.status(201).json({
        success: true,
        message: "Leave type created successfully",
        data: newType,
      });
    } catch (error) {
      console.error("Error creating leave type:", error.message);
  
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  };
  export const getLeaveTypes = async (req, res) => {
    try {
      // Fetch all leave types from the database
      const leaveTypes = await Type.find();
  
      // Check if there are no leave types
      if (leaveTypes.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No leave types found",
        });
      }
  
      // Return the list of leave types
      res.status(200).json({
        success: true,
        data: leaveTypes,
      });
    } catch (error) {
      console.error("Error fetching leave types:", error.message);
  
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  };
 // Get all leave periods
export const getLeavePeriods = async (req, res) => {
    try {
      // Fetch all leave periods from the database
      const leavePeriods = await Period.find();
  
      // Check if there are no leave periods
      if (leavePeriods.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No leave periods found",
        });
      }
  
      // Return the list of leave periods
      res.status(200).json({
        success: true,
        data: leavePeriods,
      });
    } catch (error) {
      console.error("Error fetching leave periods:", error.message);
  
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
};

// Create leave period by admin
export const leavePeriod = async (req, res) => {
    const { name, startTime, endTime,rate, description } = req.body;
    try {
        // Check if a leave period with the same name already exists
        const existingPeriod = await Period.findOne({ name });
        
        if (existingPeriod) {
            return res.status(400).json({
                success: false,
                message: "Leave period with this name already exists."
            });
        }

        // Create a new leave period
        const newPeriod = new Period({ name, startTime, endTime,rate, description });
        await newPeriod.save(); // Use `save()` on the `newPeriod` instance

        res.status(201).json({
            success: true,
            message: "Leave period created successfully",
            data: newPeriod
        });
    } catch (error) {
        console.error("Error creating leave period:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create leave period.",
            error: error.message
        });
    }
};


//admin leave balance - fill



export const createLeaveBalance = async (req, res) => {
    const { employeeId, leaveTypeIds, balances } = req.body;
  
    try {
      // Validate request
      if (!employeeId || !leaveTypeIds || !balances || leaveTypeIds.length !== balances.length) {
        return res.status(400).json({
          success: false,
          message: "Invalid input data. Ensure all fields are provided and properly formatted.",
        });
      }
  
      // Check for existing employee record
      const existingRecord = await Balance.findOne({ employeeId });
      if (existingRecord) {
        return res.status(400).json({
          success: false,
          message: "Employee leave balance record already exists.",
        });
      }
  
      // Create leave balance record
      const newBalance = new Balance({
        employeeId,
        leaveTypes: leaveTypeIds,
        leaveBalances: leaveTypeIds.map((leaveTypeId, index) => ({
          leaveType: leaveTypeId,
          balance: balances[index],
          available: balances[index],
        })),
      });
  
      // Save to database
      await newBalance.save();
  
      // Respond with success
      res.status(201).json({
        success: true,
        message: "Leave balance created successfully.",
        data: newBalance,
      });
    } catch (error) {
      console.error("Error creating leave balance:", error.message);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating leave balance.",
        error: error.message,
      });
    }
  };
  
export const updateLeaveBalance = async (req, res) => {
   
    const { employeeId, leaveTypeIds, balances } = req.body;
  
    try {
      // Check if the employee already has a leave balance record
      let existingBalance = await Balance.findOne({ employeeId });
  
      if (existingBalance) {
        // Update the existing balance document
        existingBalance.leaveTypes = leaveTypeIds;
        existingBalance.leaveBalances = leaveTypeIds.map((leaveTypeId, index) => ({
          leaveType: leaveTypeId,
          balance: balances[index],
        }));
  
        // Save the updated balance
        await existingBalance.save();
  
        return res.status(200).json({
          success: true,
          message: "Leave balance updated successfully",
          data: existingBalance,
        });
      } else {
        // If no record exists, create a new balance document
        const newBalance = new Balance({
          employeeId,
          leaveTypes: leaveTypeIds,
          leaveBalances: leaveTypeIds.map((leaveTypeId, index) => ({
            leaveType: leaveTypeId,
            balance: balances[index],
          })),
        });
  
        // Save the new balance
        await newBalance.save();
  
        return res.status(201).json({
          success: true,
          message: "Leave balance created successfully",
          data: newBalance,
        });
      }
    } catch (error) {
      console.error("Error updating or creating leave balance:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to update or create leave balance",
        error: error.message,
      });
    }
  };

export const getAllEmployeeLeaveBalanceDetails = async (req, res) => {
  try {
    // Fetch all leave balance records from the database
    const leaveBalances = await Balance.find()
      .populate('leaveTypes') // Populate leave types with their details
      .populate('leaveBalances.leaveType'); // Populate the leave type in each balance

    // Check if there are no records
    if (leaveBalances.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No employee leave balance records found",
      });
    }

    // Return the list of leave balances
    res.status(200).json({
      success: true,
      data: leaveBalances,
    });
  } catch (error) {
    console.error("Error fetching employee leave balance details:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee leave balance details.",
      error: error.message,
    });
  }
};
export const getAllLeaves = async (req, res) => {
  try {
    // Fetch all leaves from the database
    const leaves = await Leave.find();

    // Send a successful response
    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    console.error("Error fetching leaves:", error);

    // Send an error response with appropriate status code and message
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching leaves.",
      error: error.message, // Optionally include the error message
    });
  }
};
export const approve = async (req, res) => {
  try {
    const { leaveId } = req.params; // Extract leaveId from the route parameters
    const leave = await Leave.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave not found" });
    }

    leave.status = "approved"; // Update the status to "approved"
    await leave.save();

    return res.status(200).json({ success: true, message: "Leave approved successfully", data: leave });
  } catch (error) {
    console.error("Error approving leave:", error);
    return res.status(500).json({ success: false, message: "Failed to approve leave", error: error.message });
  }
};

export const reject = async (req, res) => {
  try {
    const { leaveId } = req.params; // Extract leaveId from the route parameters
    const leave = await Leave.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave not found" });
    }

    leave.status = "rejected"; // Update the status to "approved"
    await leave.save();

    return res.status(200).json({ success: true, message: "Leave reject successfully", data: leave });
  } catch (error) {
    console.error("Error approving leave:", error);
    return res.status(500).json({ success: false, message: "Failed to approve leave", error: error.message });
  }
};