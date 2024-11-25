import mongoose from "mongoose";

// Define the leaveBalanceSchema
const leaveBalanceSchema = new mongoose.Schema({
  employeeId: {
    type: String, // Assuming employeeId is a string
    required: true,
  },
  leaveTypes: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the leave types
      ref: 'Type', // Assuming you have a LeaveType model
      required: true,
    }
  ],
  leaveBalances: [
    {
      leaveType: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the LeaveType model
        ref: 'Type', // This links to your LeaveType model
        required: true,
      },
      balance: {
        type: Number, // The leave balance for this leave type
        default: 0, // Set a default balance
      },
      available: {
        type: Number, // The leave balance for this leave type
        default: 0, // Set a default balance
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Create a model for leave balances
const Balance = mongoose.model('Balance', leaveBalanceSchema);
export default Balance;
