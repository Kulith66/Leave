
import express,{Router} from 'express';
import {addLeave, oneEmployeeAllLeaveDetails, oneEmployeeLeaveBalanceDetails, OneleaveDetails} from "../controller/leaveController.js";
 
const router = express.Router();

router.post('/add-leave/:employeeId', addLeave)
router.get('/getLeave/:leaveId', OneleaveDetails)

// Assuming you're using Express for routing
router.get('/getBalance/:employeeId', oneEmployeeLeaveBalanceDetails);

router.get('/OneEmpAll/:employeeId',oneEmployeeAllLeaveDetails)

export default router;