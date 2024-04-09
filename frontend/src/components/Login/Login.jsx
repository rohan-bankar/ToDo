import React, { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function Login() {
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const navigation = useNavigate()

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
        axios.post('http://localhost:3000/api/v1/users/login',{email,password})
        .then((result) =>{
            console.log(result);
            // const accessToken =result.data.data.accessToken
            const {accessToken,refreshToken} = result.data.data;

            localStorage.clear()
            localStorage.setItem('accessToken',accessToken);
            localStorage.setItem('refreshToken',refreshToken);
            console.log(accessToken);
            console.log(refreshToken);
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

  return (
    <div className='w-1/4 my-56 mx-auto'>
        <form onSubmit={handleSubmit} className='p-2'>
            <h1 className='text-center text-3xl'>Login</h1>
            <div>
                <label htmlFor="email">
                    <strong>Email<span>*</span></strong>
                </label><br />
                <input 
                    type="text"
                    placeholder=' Enter Email'
                    name='email'
                    className='border border-black w-full my-2 h-9'
                    onChange={(e)=> setEmail(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="password">
                    <strong>Password<span>*</span></strong>
                </label><br />
                <input 
                    type="text"
                    placeholder=' Enter Password'
                    name='password'
                    className='border border-black w-full my-2 h-9'
                    onChange={(e)=> setPassword(e.target.value)}
                />
            </div>

            <button className='border border-black w-full my-2 h-10'>login</button>
            <div id='message'></div>
        </form>
    </div>
  )
}

export default Login