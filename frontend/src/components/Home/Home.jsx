import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


function Home() {
  const navigate = useNavigate()

  const handleSubmit = (e) =>{
    e.preventDefault()
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
    axios.post('http://localhost:3000/api/v1/users/logout', {}, {
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
})

    .then(result =>{
      console.log(result);
      localStorage.removeItem('accessToken')
      navigate('/login')
    })
    .catch(error =>{
      console.log(error,"logout task failed");
    })
  }
  return (
    <>
    <form>
    <h1>Home page</h1>
    <button onClick={handleSubmit} type='submit'>Logout</button>
    </form>
    </>
  )
}

export default Home