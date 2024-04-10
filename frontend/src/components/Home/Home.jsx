import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [taskContent,setTaskContent] = useState('')
  const [tasks,setTasks] = useState([])
  // const [taskCount,setTaskCount] = useState()
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
      // console.log(response);
      // setTaskCount(response.data.message)
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
      // setCompletedTaskId(taskId)
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
    // <div style={{backgroundImage:"url(/icon-cross.svg)"}}>
    <div>
      <div className='w-1/2 my-20 mx-auto'>
        <div className='my-10 relative'>
          <h1 className='text-4xl font-bold text-white'>T O D O</h1>
          <img className='absolute right-8 top-2' src="/icon-sun.svg" alt="" />
          <img className='absolute right-8 top-2 hidden' src="/icon-moon.svg" alt="" />
        </div>
        <form onSubmit={handleAddTask}>
          <div className='flex'>
        <input className='w-10/12 h-14 text-2xl mr-3 text-white rounded' 
        style={{backgroundColor:'hsl(235, 24%, 19%)'}}
        type="text"
        value={taskContent}
        onChange={(e)=>setTaskContent(e.target.value)}
        />
        <button className='bg-white w-20 rounded-lg font-bold' type='submit'>Add</button><br />
          </div>
        </form>
        <div style={{backgroundColor:'hsl(235, 24%, 19%)'}} className='rounded w-10/12 py-1 mt-5'>
          <div>
            {tasks.map((task)=>(
              <div style={{backgroundColor:'hsl(235, 24%, 19%)'}} className='w-full h-12 text-2xl relative border-b border-black text-white' key={task._id}>
                <span className='ml-2'
                  style={{ 
                    textDecoration: task.completed ? "line-through" : "none",
                    cursor: "pointer"
                  }}
                  onClick={() => handelTaskCompleted(task._id)}
                  >{ task.content}
                </span>
                <button className='absolute right-2 top-2' onClick={()=>handelDeleteTask(task._id)}><img src="/icon-cross.svg" alt="" /></button>
              </div>
            ))}
          </div>
          <div className='flex p-5 font-bold'>
            {/* <p>items left:{taskCount}</p> */}
            <div className=''>
            <button className='ml-4 hover:text-white' onClick={fetchTasks}>All</button>
            <button className='ml-4 hover:text-white' onClick={handleActiveTask}>Active</button>
            <button className='ml-4 hover:text-white' onClick={handleCompletedTask}>Completed</button>
            </div>
            <div>
            <button className='ml-56 hover:text-white' onClick={handleDeleteCompleted}>Clear Completed</button>
            </div>
          </div>
        </div>
          <button onClick={handleLogout} >Logout</button><br />
          <button onClick={()=>navigate('/password')}>Change Password</button><br />
      </div>
    </div>
  )
}

export default Home