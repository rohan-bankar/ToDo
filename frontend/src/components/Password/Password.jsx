import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function Password() {
  const [oldPassword,setOldPassword] = useState()
  const [newPassword,setNewPassword] = useState()
  const navigation = useNavigate()
  const handleSubmit = async (e) =>{
    e.preventDefault()
try {
  const accessToken = localStorage.getItem('accessToken');
  if(!accessToken){
    throw new error('Access token not found')
  }
    const response = await axios.post(
      'http://localhost:3000/api/v1/users/change-password',{oldPassword,newPassword},
      {
        headers:{
          Authorization:`Bearer ${accessToken}`,
        },
      }
    )

    console.log(response.data);
    showMessage(response.data.message);
    localStorage.removeItem('accessToken')
    navigation('/login');
} catch (error) {
  console.error(error);
  showMessage(error.response?.data?.error || 'Please try again');
  }
}

  function showMessage(message){
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message
  }
  return (
    <div className='w-1/4 my-20 mx-auto' onSubmit={handleSubmit}>
      <form>
      <h1 className='text-center text-3xl'>Change Password</h1>
            <div>
                <label htmlFor="oldPassword">
                    <strong>Old Password<span>*</span></strong>
                </label><br />
                <input 
                    type="password"
                    placeholder=' Enter Old Password'
                    name='oldPassword'
                    className='border border-black w-full my-2 h-9'
                    onChange={(e)=> setOldPassword(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="password">
                    <strong>New Password<span>*</span></strong>
                </label><br />
                <input 
                    type="password"
                    placeholder=' Enter New Password'
                    name='newPassword'
                    className='border border-black w-full my-2 h-9'
                    onChange={(e)=> setNewPassword(e.target.value)}
                />
            </div>

            <button type='submit' className='border border-black w-full my-2 h-10'>Submit</button>
            <div id='message'></div>
      </form>
    </div>
  )
}

export default Password