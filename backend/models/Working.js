import mongoose from "mongoose";

const WorkingSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    clockIn: {
        type: String, // Time can be stored as a string in "HH:mm" format
        required: true,
        default: null,

    },
    clockOut: {
        type: String, // Time can be stored as a string in "HH:mm" format
        default: null,
    },
    totalHours: {
        type: Number,
        default: 0,
    },
});

const Working = mongoose.model('Working', WorkingSchema);
export default Working;
