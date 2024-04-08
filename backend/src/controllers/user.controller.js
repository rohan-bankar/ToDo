import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import {deleteOnCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const generateAccessAndRefreshTokens = async(userID)=>{
    try {
        const user = await User.findById(userID)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    // get user details
   const {username,email,password} = req.body
    // validation - not empty
   if(
    [username,email,password].some((field)=>field?.trim()=== "")
   ){
    throw new ApiError(400,"All Fields are required")
   }
   // check if user already exists
   const existedUser = await User.findOne({
    $or:[{username},{email}]
   })

   if(existedUser){
    throw new ApiError(409,"User with email or username already exists")
   }

   // check for avatar
   let avatarLocalPath;
   if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
        avatarLocalPath = req.files.avatar[0].path;
   }
   
   //upload them to cloudinary
   const avatar = await uploadOnCloudinary(avatarLocalPath)

   // create user object

   const user = await User.create({
    username,
    avatar:avatar?.url || "",
    email,
    password
   })

   //remove password and refresh token field from response
   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   // check for user creation
   if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
   }

   // return response
   return res.status(201).json(
    new ApiResponse(200,createdUser,"User registration successfully")
   )

})

const loginUser = asyncHandler(async(req,res)=>{

    const {email,password} = req.body

    // username or email
    if(!email)
    {
        throw new ApiError(400,"username or email is required")
    }

    // find user
    const user = await User.findOne({
        // $or:[{username},{email}] 
        email
    })

    if(!user){
        throw new ApiError(401,"user does not exist")
    }

    // password check
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"username or password is incorrect")
    }

    // access and validate token
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    //update user
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User logged in successfully"
        )
    )
})  

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET)
            const user = await User.findById(decodedToken?._id)
            
            if(!user){
                throw new ApiError(401,"invalid refresh token")
            }
    
            if(incomingRefreshToken !== user?.refreshToken){
                throw new ApiError(401,"Refresh token is expired")
            }
    
            const options = {
                httpOnly:true,
                secure:true
            }
    
            const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
            return res
            .status(200)
            .cookie("accessToken",accessToken)
            .cookie("refreshToken",newRefreshToken)
            .json(
                new ApiResponse(
                    200,
                    {accessToken,refreshToken: newRefreshToken},
                    "Access token refresh"
                )
            )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }
})  

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const{oldPassword,newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200),req.user,"current user fetched successfully")

})

const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }
    // ToDo: delete old image create utility 2:20 time stamp
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading on avatar")
    }


    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    ).select("-password")

    

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"Avatar image updated successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAvatar
}
