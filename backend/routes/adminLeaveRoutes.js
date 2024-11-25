
import express,{Router} from 'express';
import { approve, createLeaveBalance,getAllEmployeeLeaveBalanceDetails, getAllLeaves, getLeavePeriods, getLeaveTypes, leavePeriod, leaveTypes, reject, updateLeaveBalance } from '../controller/adminLeavecontroller.js';
 
const router = express.Router();

router.post('/create-leavetypes', leaveTypes)
router.post('/create-leavePeriod', leavePeriod)

router.get('/get-leavetypes', getLeaveTypes)
router.get('/get-leavePeriod', getLeavePeriods)

router.post('/leave-balance', createLeaveBalance)
router.put('/leave-balanceUpdate', updateLeaveBalance)

router.get('/get-all-employee-leave-balances', getAllEmployeeLeaveBalanceDetails);
router.get('/getLeaves', getAllLeaves)

router.put("/approve/:leaveId", approve)
router.put("/reject/:leaveId", reject)



export default router;