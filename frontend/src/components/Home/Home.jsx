import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


function Home() {
  const [taskContent,setTaskContent] = useState('')
  const [tasks,setTasks] = useState([])
  const navigate = useNavigate()

  const getAccessToken = ()=>{
    return localStorage.getItem('accessToken');
  }
  useEffect(()=>{
    fetchTasks();
  },[])

  const fetchTasks = async ()=>{
    try {
      const accessToken = getAccessToken()
      const response = await axios.get('http://localhost:3000/api/v1/tasks/all-task',{
        headers:{
          Authorization:`Bearer ${accessToken}`
        },
        withCredentials:true
      })
      setTasks(response.data.data)
    } catch (error) {
      console.log('Error fetching tasks:', error);
    }
  }

  const handleAddTask = async (e)=>{
    e.preventDefault();
    try {
      const accessToken = getAccessToken()
      const response = await axios.post('http://localhost:3000/api/v1/tasks/user-task',
        {content:taskContent},
        {
          headers:{
            Authorization:`Bearer ${accessToken}`
          },
          withCredentials:true
        }
      )
      setTaskContent('')
      setTasks([...tasks,response.data.data])
    } catch (error) {
      console.log('Error adding task',error);
    }
  }

  const handleLogout = (e) =>{
    e.preventDefault()
    const accessToken = getAccessToken();
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
    <form onSubmit={handleAddTask}>
    <h1>Home page</h1>
    <input className='border border-black' 
    type="text"
    value={taskContent}
    onChange={(e)=>setTaskContent(e.target.value)}
    />
    <button type='submit'>Add</button><br />
    <button onClick={handleLogout} >Logout</button><br />
    <button onClick={()=>navigate('/password')}>Change Password</button>
    </form>
    <div>
      <h2>Task List</h2>
      {tasks.map((task)=>(
        <li key={task._id}>{task.content}</li>
      ))}
    </div>
    </>
  )
}

export default Home