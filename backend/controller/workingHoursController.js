import Leave from "../models/leave.js";
import Working from "../models/Working.js";
import moment from "moment-timezone";

// Helper function to get current Sri Lanka time
const getSriLankaTime = () => {
    return moment.tz("Asia/Colombo").toDate(); // Get current time in Sri Lanka
};

// Helper function to format date to Sri Lanka local time
const formatToSriLankaTimeString = (date) => {
    return moment(date).tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss"); // Format as string in Sri Lanka time
};

// Clock-in function
export const clockIn = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const currentSLTime = getSriLankaTime(); // Get current Sri Lanka time
        const startOfSLDay = moment(currentSLTime).startOf("day").toDate(); // Start of the day in Sri Lanka

        // Check if the employee is on leave
        const isLeave = await Leave.findOne({ employeeId, startDate: startOfSLDay });

        if (isLeave) {
            isLeave.leaveStatus = "cancelled";
            await isLeave.save();
        }

        // Save clock-in details
        const entity = new Working({
            employeeId,
            clockIn: currentSLTime, // Save in Sri Lanka time
            date: Date.now()
        });
        await entity.save();

        const message = isLeave
            ? "You were on leave, but it has been cancelled and clock-in has been recorded."
            : "Clock-in recorded successfully.";

        return res.status(200).send({
            entity,
            success: true,
            message,
            clockIn: formatToSriLankaTimeString(currentSLTime),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "An error occurred while clocking in.", error });
    }
};

export const clockOut = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const currentSLTime = getSriLankaTime();
        const startOfSLDay = moment(currentSLTime).startOf("day").toDate(); 
        const endOfSLDay = moment(currentSLTime).endOf("day").toDate(); 

        const entity = await Working.findOne({
            employeeId,
            date: { $gte: startOfSLDay, $lte: endOfSLDay },
        });

        if (!entity) {
            return res.status(404).send({ success: false, message: "No clock-in record found for today." });
        }

        const clockOutTime = currentSLTime;
        const clockInTime = new Date(entity.clockIn);
        const totalHours = ((clockOutTime - clockInTime) / (1000 * 60 * 60)).toFixed(2);

        entity.clockOut = clockOutTime; 
        entity.totalHours = totalHours;
        await entity.save();
console.log(clockIn)
        return res.status(200).send({
            success: true,
            message: "Clock-out recorded successfully.",
            data: {
                clockIn: formatToSriLankaTimeString(new Date(entity.clockIn)),
                clockOut: formatToSriLankaTimeString(clockOutTime),
                totalHours,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "An error occurred while clocking out.", error });
    }
};

///////////////////////////////////////////////////////////////////////////////////////
export const getWorkingHoursInWeek = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const today = moment.tz("Asia/Colombo").endOf("day").toDate();
        const sevenDaysAgo = moment.tz("Asia/Colombo").subtract(7, "days").startOf("day").toDate();

        // Query the database for records in the past 7 days
        const workingRecords = await Working.find({
            employeeId,
            date: { $gte: sevenDaysAgo, $lte: today },
        });

        if (!workingRecords || workingRecords.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No working records found for the past 7 days.",
            });
        }

        // Calculate total working hours
        let totalHours = 0;
        workingRecords.forEach((record) => {
            if (record.totalHours) {
                totalHours += parseFloat(record.totalHours);
            }
        });

        return res.status(200).send({
            success: true,
            message: "Total working hours for the past 7 days retrieved successfully.",
            data: {
                totalHours: totalHours.toFixed(2),
                records: workingRecords.map((record) => {
                    const clockInDate = new Date(record.clockIn);
                    return {
                        date: moment(record.date).tz("Asia/Colombo").format("YYYY-MM-DD"),
                        clockIn: moment(record.clockIn).tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss"),
                        clockOut: record.clockOut
                            ? moment(record.clockOut).tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss")
                            : null,
                        totalHours: record.totalHours,
                        day: splitDate(clockInDate),
                    };
                }),
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "An error occurred while retrieving working hours.",
            error,
        });
    }
};

const splitDate = (date) => {
    return date.toDateString().split(" ")[0]; // Extract day (e.g., "Fri")
};

//////////////////////////////////////////////////////////////////////////////////////

export const getWorkingHoursInYear = async (req, res) => {
        const { employeeId } = req.params;

        try {
            // Get the current date in Sri Lanka time (Asia/Colombo)
            const today = moment.tz("Asia/Colombo");

            // Calculate the start of the current month and the start of the month 12 months ago
            const currentMonth = today.startOf("month").toDate();
            const past12monthsStart = today.clone().subtract(12, "months").startOf("month").toDate();

            // Query the database for records from the past 12 months
            const workingRecords = await Working.find({
                employeeId,
                date: { $gte: past12monthsStart, $lte: currentMonth },
            });

            if (!workingRecords || workingRecords.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: "No working records found for the past 12 months.",
                });
            }
            
            // Prepare the result to store total hours per month
            let monthlyWorkingHours = [];

            // Iterate over the past 12 months and calculate total hours worked each month
            for (let i = 0; i <= 12; i++) {
                const startOfMonth = today.clone().subtract(i, "months").startOf("month");
                const endOfMonth = startOfMonth.clone().endOf("month");
                
                // Filter the records for the current month
                const monthRecords = workingRecords.filter((record) => {
                    const recordDate = moment(record.date).tz("Asia/Colombo");
                    return recordDate.isBetween(startOfMonth, endOfMonth, null, "[]");
                });

                // Calculate total hours for the current month
                let totalHoursForMonth = 0;
                monthRecords.forEach((record) => {
                    if (record.totalHours) {
                        totalHoursForMonth += parseFloat(record.totalHours);
                    }
                });

                // Add the result for this month
                monthlyWorkingHours.push({
                    month: startOfMonth.format("MMMM YYYY"),  // Month name with year (e.g., "January 2025")
                    totalHours: totalHoursForMonth.toFixed(2),
                });
            }

            return res.status(200).send({
                success: true,
                message: "Total working hours for the last 12 months retrieved successfully.",
                data: monthlyWorkingHours,
            });

        } catch (error) {
            console.error(error);
            return res.status(500).send({
                success: false,
                message: "An error occurred while retrieving working hours.",
                error,
            });
        }
    };

export const getWorkingHoursForCurrentMonth = async (req, res) => {
    const { employeeId } = req.params;

    try {
        // Get the current date in Sri Lanka time (Asia/Colombo)
        const today = moment.tz("Asia/Colombo");

        // Calculate the start of the current month and the end of the current month
        const startOfMonth = today.startOf("month").toDate();
        const endOfMonth = today.endOf("month").toDate();

        // Query the database for records from the current month
        const workingRecordsC = await Working.find({
            employeeId,
            date: { $gte: startOfMonth, $lte: endOfMonth },
        });

        if (!workingRecordsC || workingRecordsC.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No working records found for the current month.",
            });
        }

        // Calculate total hours worked in the current month
        let totalHoursForMonth = 0;
        workingRecordsC.forEach((record) => {
            if (record.totalHours) {
                totalHoursForMonth += parseFloat(record.totalHours);
            }
        });

        return res.status(200).send({
            success: true,
            message: "Total working hours for the current month retrieved successfully.",
            data: {
                month: today.format("MMMM YYYY"),  // Month name with year (e.g., "January 2025")
                totalHours: totalHoursForMonth.toFixed(2),
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "An error occurred while retrieving working hours.",
            error,
        });
    }
};

