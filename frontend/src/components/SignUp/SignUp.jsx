import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useTheme from '../../context/Theme'
function SignUp() {
    const [username,setUsername] = useState()
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const {themeMode} = useTheme()
    const navigate = useNavigate()

    // const [avatar,setAvatar] = useState()

    const handleSubmit = (e)=>{
        e.preventDefault()
        axios.post('/api/v1/users/register',{username,email,password})
        .then(result => {console.log(result)
            showMessage(result.data.message)
        })
        .catch(error => {console.log(error)
            showMessage(error.response.data.error || "Registration failed. please try again")
        })
        // if(error.response) console.log(error.response.data);
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
    <div className='pt-10 text-white font-bold' style={{backgroundColor, backgroundImage, backgroundRepeat:'no-repeat',height:'92.6vh'}}>
        <div className='w-1/3 max-sm:w-10/12 mx-auto p-5 bg-indigo-600 bg-opacity-30 rounded'>
                <form className='p-4' onSubmit={handleSubmit}>
                    <h1 className='text-center text-3xl'>Register</h1>
                    <div>
                        <label htmlFor="username">
                            <strong>User Name<span className='text-red-600'> *</span></strong>
                        </label><br />
                        <input 
                            type="text"
                            placeholder=' Enter Name'
                            name='username'
                            className='border-none rounded w-full my-2 h-9 text-black'
                            onChange={(e)=> setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="email">
                            <strong>Email<span className='text-red-600'> *</span></strong>
                        </label><br />
                        <input 
                            type="text"
                            placeholder=' Enter Email'
                            name='email'
                            className='border-none rounded w-full my-2 h-9 text-black'
                            onChange={(e)=> setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="password">
                            <strong>Password<span className='text-red-600'> *</span></strong>
                        </label><br />
                        <input 
                            type="password"
                            placeholder=' Enter Password'
                            name='password'
                            className='border-none rounded w-full my-2 h-9 text-black'
                            onChange={(e)=> setPassword(e.target.value)}
                        />
                    </div>

                    {/* <div>
                        <label htmlFor="avatar">
                            <strong>Profile Image</strong>
                        </label><br />
                        <input 
                            type="file"
                            name='avatar'
                            className='my-2'
                            onChange={(e)=> setAvatar(e.target.files[0])}
                        />
                    </div> */}

                    <button type='submit' className='border-none rounded bg-indigo-600 w-full my-2 h-10'>SignUp</button>
                    <p>Already Have an Account</p>
                    <button onClick={()=>navigate('/login')} className='border-none rounded bg-indigo-600 w-full my-2 h-10'>login</button>
                    <div className='text-red-600' id='message'></div>
                </form>
        </div>
    </div>
  )
}

export default SignUp