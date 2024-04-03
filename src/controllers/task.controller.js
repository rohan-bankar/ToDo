import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
// import { User } from "../models/user.model";

const userTask = asyncHandler(async(req,res)=>{
    // task added 
    const {content} = req.body
    
    // validation not empty
    if(!content || content.trim() === ""){
        throw new ApiError(400,"Add Task")
    } 

    const task = await Task.create({
        content,
        createdBy: req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,task,"Task added successfully")
    )
})

const deleteTask =asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const oldTask = await Task.findOneAndDelete(
        {createdBy:userId},
        {sort:{createdAt:1}}
    )

    if(oldTask){
        return res
        .status(200)
        .json(
            new ApiResponse(200,oldTask,"Old task delete successfully")
        )
    }else{
        throw new ApiError(404,"No task found to delete")
    }
}) 

const deleteAll = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const oldTask = await Task.deleteMany(
        {createdBy:userId}
    )
    
    if(oldTask){
        return res
        .status(200)
        .json(
            new ApiResponse(200,null,"All tasks delete successfully")
        )
    }else{
        throw new ApiError(404,"No task found to delete")
    }
})

const taskDone = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const taskId = req.params.taskId

    const updatedTask = await Task.findOneAndUpdate(
        {_id:taskId,createdBy:userId},
        {completed:true},
        {new:true}
    )
    
    if(updatedTask){
        return res
        .status(200)
        .json(
            new ApiResponse(200,updatedTask,"Task marked as completed successfully")
        )
    }else{
        throw new ApiError(404,"Task not found or unauthorized")
    }
})

const showAllTask = asyncHandler(async(req,res)=>{
    const userId = req.user._id

    const tasks = await Task.find(
        //completed:true or false to display task as per status
        {createdBy:userId,completed:false}, 
    )

    if(tasks.length > 0){
        return res
        .status(200)
        .json(
            new ApiResponse(200,tasks,"All tasks view")
        )
    }else{
        throw new ApiError(404,"No tasks found for the user") 
    }
})

export{
    userTask,
    deleteTask,
    deleteAll,
    taskDone,
    showAllTask
}