import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { showIncompleteTask } from '../../../../backend/src/controllers/task.controller'


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

  const handelDeleteTask = async (taskId)=>{
    try {
      const accessToken = getAccessToken();
      const response = await axios.delete(`http://localhost:3000/api/v1/tasks/delete-task/${taskId}`,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      })
      setTasks(tasks.filter(task => task._id !== taskId))
      console.log('Task deleted successfully:',response.data.message);
    } catch (error) {
      console.log('Error deleting task',error);
    }
  }

  const handelTaskCompleted = async(taskId)=>{
    try {
      const accessToken = getAccessToken()
      const response = await axios.patch(`http://localhost:3000/api/v1/tasks/c/${taskId}`,{},{
        headers:{
          Authorization:`Bearer ${accessToken}`
        },
        withCredentials: true
      })
      const updatedTask = tasks.map(task =>{
        if(task._id === taskId){
          return response.data.data
        }
        return task
      })
      setTasks(updatedTask)
    } catch (error) {
      console.log('Error marking task as completed',error);
    }
  }

  const handleActiveTask = async()=>{
    try {
      const accessToken = getAccessToken()
      const response = await axios.get('http://localhost:3000/api/v1/tasks/incomplete-task',{
        headers:{
          Authorization:`Bearer ${accessToken}`
        },
        withCredentials:true
      })
      setTasks(response.data.data)
    } catch (error) {
      console.log('Error fetching incomplete tasks:',error);
    }
  }

  const handleCompletedTask = async()=>{
    try {
      const accessToken = getAccessToken()
      const response = await axios.get('http://localhost:3000/api/v1/tasks/complete-task',{
        headers:{
          Authorization:`Bearer ${accessToken}`
        },
        withCredentials:true
      })
      setTasks(response.data.data)
    } catch (error) {
      console.log('Error fetching completed tasks:',error);
    }
  }

  const handleDeleteCompleted = async()=>{
    try {
      const accessToken = getAccessToken();
      await axios.delete('http://localhost:3000/api/v1/tasks/delete-completed',{
        headers:{
          Authorization:`Bearer ${accessToken}`
        },
        withCredentials:true
      })
      fetchTasks()
    } catch (error) {
      console.log('Error deleting completed tasks:',error);
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
    </form>
    <div>
      <h2>Task List</h2>
      {tasks.map((task)=>(
        <div key={task._id}>
          <span>{task.content}</span>
          <button onClick={()=>handelTaskCompleted(task._id)}>Completed</button>
          <button onClick={()=>handelDeleteTask(task._id)}><img src="./public/icon-cross.svg" alt="" /></button>
        </div>
      ))}
    </div>
    <button onClick={handleLogout} >Logout</button><br />
    <button onClick={()=>navigate('/password')}>Change Password</button><br />
    <button onClick={fetchTasks}>All</button><br />
    <button onClick={handleActiveTask}>Active</button><br />
    <button onClick={handleCompletedTask}>Completed</button><br />
    <button onClick={handleDeleteCompleted}>Clear Completed</button>
    </>
  )
}

export default Home