import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  leaveType: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the leave types
      ref: 'Type', // Assuming you have a Type model
      required: true,
    },
    
  ],leaveTypeName:{
      type: String, // Assuming leaveTypeName is a string
      required: true,
    },
  leavePeriod: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to the periods
      ref: 'Period', // Assuming you have a Period model
      required: true,
    },
    
  ],leavePeriodName:{
      type: String, // Assuming leaveTypeName is a string
      required: true,
    },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'], // Include 'pending' as an option
    default: 'pending',
  },
});

// Export the Leave model
const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
