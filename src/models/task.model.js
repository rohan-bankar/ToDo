import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        content:{
            type:String,
            required:true
        },
        completed:{
            type:Boolean,
            default:false
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }
)

export const Task = mongoose.model("Task",taskSchema);