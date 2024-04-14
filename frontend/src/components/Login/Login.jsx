import React, { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useTheme from '../../context/Theme'
function Login() {
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const navigation = useNavigate()
    const {themeMode} = useTheme()
    // useEffect(() => {
    //     const refreshToken = async () => {
    //       try {
    //         const response = await axios.post(
    //           'http://localhost:3000/api/v1/users/refresh-token',
    //           {},
    //           {
    //             withCredentials: true, // Include cookies in the request
    //           }
    //         );
    //         console.log(response);
    //         const { accessToken } = response.data;
    //         console.log(accessToken);
    //         localStorage.setItem('accessToken', accessToken);
    //       } catch (error) {
    //         console.log('Error refreshing access token:', error);
    //         navigation('/login'); // Redirect to login page if refresh token fails
    //       }
    //     };
    
    //     refreshToken(); // Refresh access token on component mount
    
    //     // Optionally, you can specify dependencies for useEffect if you want to refresh the token under certain conditions
    //   }, [navigation]);

    const handleSubmit = (e)=>{
        e.preventDefault()
        axios.post('/api/v1/users/login',{email,password})
        .then((result) =>{
            console.log(result);
            // const accessToken =result.data.data.accessToken
            const {accessToken,refreshToken} = result.data.data;

            localStorage.clear()
            localStorage.setItem('accessToken',accessToken);
            localStorage.setItem('refreshToken',refreshToken);
            // console.log(accessToken);
            // console.log(refreshToken);
            navigation('/home')
        })
        .catch(error => {console.log(error)
            showMessage("email or password is incorrect")
        })
    }

    function showMessage(message){
        const messageDiv = document.getElementById('message')
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
        <div className='w-1/4 max-sm:w-10/12 mx-auto p-5 bg-indigo-600 bg-opacity-30 rounded'>
            <form onSubmit={handleSubmit} className='p-2'>
                <h1 className='text-center text-3xl'>Login</h1>
                <div>
                    <label htmlFor="email">
                        <strong>Email<span className='text-red-600'> *</span></strong>
                    </label><br />
                    <input 
                        type="text"
                        placeholder=' Enter Email'
                        name='email'
                        className='border-none w-full my-2 h-9 rounded text-black'
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
                        className='border-none w-full my-2 h-9 rounded text-black'
                        onChange={(e)=> setPassword(e.target.value)}
                    />
                </div>
                <button type='submit' className='border-none rounded bg-indigo-600 w-full my-2 h-10'>login</button>
                <p>Don't Have an Account</p>
                <button onClick={()=>navigation('/register')} className='border-none rounded bg-indigo-600 w-full my-2 h-10'>SignUp</button>
                <div className='text-red-600' id='message'></div>
            </form>
        </div>
    </div>
  )
}

export default Login