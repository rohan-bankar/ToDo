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
    const userId = req.user._id
    const task = await Task.create({
        content,
        createdBy: userId
    })
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,task,"Task added successfully")
    )
})

const deleteTask =asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const taskId = req.params.taskId
    const oldTask = await Task.findOneAndDelete({
        // {createdBy:userId},
        // {sort:{createdAt:1}}
        _id: taskId,
        createdBy: userId
})

    if(oldTask){
        return res
        .status(200)
        .json(
            new ApiResponse(200,oldTask,"Task delete successfully")
        )
    }else{
        throw new ApiError(404,"No task found to delete")
    }
}) 

const deleteCompleted = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const oldTask = await Task.deleteMany(
        {createdBy:userId,completed:true}
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

const showIncompleteTask = asyncHandler(async(req,res)=>{
    const userId = req.user._id

    const tasks = await Task.find(
        //completed:true or false to display task as per status
        {createdBy:userId,completed:false}, 
    )

    const totalCount = await Task.countDocuments(
        {createdBy:userId,completed:false}
    )

    if(tasks.length > 0){
        return res
        .status(200)
        .json(
            new ApiResponse(200,tasks,totalCount,"All tasks view")
        )
    }else{
        throw new ApiError(404,"No tasks found for the user") 
    }
})

const showCompleteTask = asyncHandler(async(req,res)=>{
    const userId = req.user._id

    const tasks = await Task.find(
        //completed:true or false to display task as per status
        {createdBy:userId,completed:true}, 
    )

    const totalCount = await Task.countDocuments(
        {createdBy:userId,completed:true}
    )

    if(tasks.length > 0){
        return res
        .status(200)
        .json(
            new ApiResponse(200,tasks,totalCount,"All tasks view")
        )
    }else{
        throw new ApiError(404,"No tasks found for the user") 
    }
})

// const showUserTask = asyncHandler(async (req, res) => {
//     const userId = req.user._id;

//     const pipeline = [
//         {
//             $match: {
//                 createdBy: new mongoose.Types.ObjectId(userId),
//                 // completed: false
//             }
//         },
//         {
//             $lookup: {
//                 from: 'users',
//                 localField: 'createdBy',
//                 foreignField: '_id',
//                 as: 'user'
//             }
//         },
//         {
//             $unwind: '$user'
//         },
//         {
//             $project: {
//                 'user.username': 1,
//                 'user.avatar': 1,
//                 // content: 1,
//                 // completed: 1
//             }
//         }
//     ];

//     const showData = await Task.aggregate(pipeline);

//    if(showData.length > 0){
//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200,showData,"User data fetch successfully")
//     )
//    }else{
//     // throw new ApiError(404,"No data found")
//     return res.status(404).json(
//         new ApiResponse(404, null, "No user data found")
//     );
//    }
   
// });

const showAllTask = asyncHandler(async(req,res)=>{
    const userId = req.user._id

    const tasks = await Task.find(
        //completed:true or false to display task as per status
        {createdBy:userId} 
    )
    const totalCount = await Task.countDocuments(
        {createdBy:userId}
    )

    if(tasks.length > 0){
        return res
        .status(200)
        .json(
            new ApiResponse(200,tasks,totalCount,"All tasks view")
        )
    }else{
        throw new ApiError(404,"No tasks found for the user") 
    }
})


export{
    userTask,
    deleteTask,
    deleteCompleted,
    taskDone,
    showIncompleteTask,
    showCompleteTask,
    showAllTask
    // showUserTask
}