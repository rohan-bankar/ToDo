import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function SignUp() {
    const [username,setUsername] = useState()
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const navigate = useNavigate()
    // const [avatar,setAvatar] = useState()

    const handleSubmit = (e)=>{
        e.preventDefault()
        axios.post('http://localhost:3000/api/v1/users/register',{username,email,password})
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

  return (
    <div className='w-1/4 my-20 mx-auto'>
        {/* <div className='p-10'> */}
            <form className='p-4' onSubmit={handleSubmit}>
                <h1 className='text-center text-3xl'>Register</h1>
                <div>
                    <label htmlFor="username">
                        <strong>User Name<span>*</span></strong>
                    </label><br />
                    <input 
                        type="text"
                        placeholder=' Enter Name'
                        name='username'
                        className='border border-black w-full my-2 h-9'
                        onChange={(e)=> setUsername(e.target.value)}
                    />
                </div>

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

                <button type='submit' className='border border-black w-full my-2 h-10'>SignUp</button>
                <p>Already Have an Account</p>
                <button onClick={()=>navigate('/login')} className='border border-black w-full my-2 h-10'>login</button>
                <div id='message'></div>
            </form>
        {/* </div> */}
    </div>
  )
}

export default SignUp