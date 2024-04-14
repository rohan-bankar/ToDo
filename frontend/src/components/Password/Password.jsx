import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useTheme from '../../context/Theme'
function Password() {
  const [oldPassword,setOldPassword] = useState()
  const [newPassword,setNewPassword] = useState()
  const {themeMode} = useTheme()
  const navigation = useNavigate()
  const handleSubmit = async (e) =>{
    e.preventDefault()
try {
  const accessToken = localStorage.getItem('accessToken');
  if(!accessToken){
    throw new error('Access token not found')
  }
    const response = await axios.post(
      '/api/v1/users/change-password',{oldPassword,newPassword},
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

  const lightThemeColor = 'hsl(0,0%,100%)'
  const darkThemeColor = 'hsl(235, 21%, 11%)' 
  const lightBgImage = 'url("/desktop-dark.jpg")'
  const darkBgImage = 'url("/desktop-light.jpg")'

  const backgroundColor = themeMode === 'dark' ? lightThemeColor : darkThemeColor
  const backgroundImage = themeMode === 'light' ? lightBgImage : darkBgImage
  return (
    <div className='pt-28 text-white font-bold' style={{backgroundColor, backgroundImage, backgroundRepeat:'no-repeat',height:'92.6vh'}}>
      <div className='w-1/4 max-sm:w-10/12 p-5 mx-auto bg-indigo-600 bg-opacity-30 rounded' >
        <form onSubmit={handleSubmit} className='p-2'>
          <h1 className='text-center text-3xl'>Change Password</h1>
              <div>
                  <label htmlFor="oldPassword">
                      <strong>Old Password<span className='text-red-600'> *</span></strong>
                  </label><br />
                  <input 
                      type="password"
                      placeholder=' Enter Old Password'
                      name='oldPassword'
                      className='border-none rounded w-full my-2 h-9 text-black'
                      onChange={(e)=> setOldPassword(e.target.value)}
                  />
              </div>

              <div>
                  <label htmlFor="password">
                      <strong>New Password<span className='text-red-600'> *</span></strong>
                  </label><br />
                  <input 
                      type="password"
                      placeholder=' Enter New Password'
                      name='newPassword'
                      className='border-none rounded w-full my-2 h-9 text-black'
                      onChange={(e)=> setNewPassword(e.target.value)}
                  />
              </div>

              <button type='submit' className='border-none rounded bg-indigo-600 w-full my-2 h-10'>Submit</button>
              <div className='text-red-600' id='message'></div>
        </form>
      </div>
    </div>
  )
}

export default Password