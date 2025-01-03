
import express,{Router} from 'express';
import { clockIn, clockOut,getWorkingHoursForCurrentMonth,getWorkingHoursInWeek ,getWorkingHoursInYear } from '../controller/workingHoursController.js';
 
const router = express.Router();

router.post("/clockIn/:employeeId",clockIn)

router.post("/clockOut/:employeeId",clockOut)

router.get("/days7/:employeeId",getWorkingHoursInWeek)

router.get("/month12/:employeeId",getWorkingHoursInYear)

router.post("/current/:employeeId",getWorkingHoursForCurrentMonth)


export default router;