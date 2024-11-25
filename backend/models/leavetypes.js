import mongoose from "mongoose";

const leaveTypesSchema = new mongoose.Schema({
    type:{
        type: 'string',
        required: true,
        
    },
    description:{
        type: 'string',
        required: true,
        
    },
    
})

const Type = mongoose.model('Type', leaveTypesSchema);
export default Type;
