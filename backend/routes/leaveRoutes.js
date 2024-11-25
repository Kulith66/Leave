
import express,{Router} from 'express';
import {addLeave, oneEmployeeLeaveBalanceDetails, OneleaveDetails} from "../controller/leaveController.js";
 
const router = express.Router();

router.post('/add-leave/:employeeId', addLeave)
router.get('/getLeave/:leaveId', OneleaveDetails)

// Assuming you're using Express for routing
router.get('/getBalance/:employeeId', oneEmployeeLeaveBalanceDetails);

export default router;