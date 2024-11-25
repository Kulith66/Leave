import mongoose from "mongoose";

const leavePeriodSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required: true,
        
    },
    startTime:{
        type: 'string',
        required: true,
        
    },
    endTime:{
        type: 'string',
        required: true,
    },
    rate:{
        type: 'number',
        required: true,
    },
    description:{
        type: 'string',
        required: true,
    },
})

const Period = mongoose.model('Period', leavePeriodSchema);
export default Period;
