import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {faCircleUser} from '@fortawesome/free-solid-svg-icons'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import useTheme from '../../context/Theme'
library.add(faCircleUser,faRightFromBracket)

function Home() {
  const [taskContent,setTaskContent] = useState('')
  const [tasks,setTasks] = useState([])
  const [isMenuOpen,setMenuOpen] = useState(false)
  const {themeMode} = useTheme()
  const navigate = useNavigate()

  const toggleMenu = ()=>{
    setMenuOpen(!isMenuOpen)
  }

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
      if(response.data && response.data.data){
        setTasks(response.data.data)
      }else{
        console.log("Empty response of missing data");
      }
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

  const lightThemeColor = 'rgb(224 231 255)'
  const darkThemeColor = 'hsl(235, 21%, 11%)' 
  const lightBgImage = 'url("/desktop-dark.jpg")'
  const darkBgImage = 'url("/desktop-light.jpg")'
  const taskBg = 'hsl(235, 24%, 19%)'

  const backgroundColor = themeMode === 'dark' ? lightThemeColor : darkThemeColor
  const backgroundImage = themeMode === 'light' ? lightBgImage : darkBgImage
  const backgroundColorTask = themeMode === 'dark' ? lightThemeColor: taskBg
  return (
    // <>
      <div style={{backgroundColor,height:'92.6vh'}}>
        <div style={{ backgroundImage, backgroundRepeat: 'no-repeat'}}>
            <div className='relative'>
            <FontAwesomeIcon  className='absolute right-24 top-5 cursor-pointer' icon="fa-solid fa-circle-user" size="2xl" onClick={toggleMenu} />
            <div style={{backgroundColor}} className={`absolute right-4 top-14 px-5 py-2 text-center  font-bold rounded ${isMenuOpen ? 'block' : 'hidden'} ${themeMode === 'dark' ? 'text-black' : 'text-white'}`}>
              <button className='p-1' onClick={()=>navigate('/password')}>Change Password</button><br />
              <button className='p-1' onClick={handleLogout}><FontAwesomeIcon icon="fa-solid fa-right-from-bracket" /> Logout</button><br />
            </div>
            </div>
          <div className='w-1/2 max-sm:w-11/12 mx-auto pt-36'>
              <form onSubmit={handleAddTask}>
                <div className='flex'>
              <input className={`w-10/12 h-14 text-2xl font-thin mr-3 rounded ${themeMode === 'dark' ? 'text-black' : 'text-white'}`} 
              style={{backgroundColor:backgroundColorTask,opacity:'.5'}}
              type="text"
              value={taskContent}
              onChange={(e)=>setTaskContent(e.target.value)}
              />
              <button  style={{backgroundColor:backgroundColorTask,opacity:'.5'}} className={`${themeMode === 'light' ? 'hover:text-white':'hover:text-sky-400'} text-gray-500  w-20 rounded-lg font-bold`} type='submit'>Add</button><br />
                </div>
              </form>
              <div style={{backgroundColor:backgroundColorTask}} className='rounded w-10/12 max-sm:w-11/12 py-1 mt-10 shadow-lg'>
                <div>
                  {tasks.map((task)=>(
                    <div style={{backgroundColor:backgroundColorTask}} className={`w-full h-12 text-2xl font-thin relative border-b border-black ${themeMode === 'dark' ? 'text-black' : 'text-white'} `} key={task._id}>
                      <span className='ml-5'
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
                <div className='flex  p-4 font-bold'>
                    <div>
                      <button><button className={`ml-4 text-gray-500 ${themeMode === 'light' ? 'hover:text-white':'hover:text-sky-400'}`} onClick={fetchTasks}>All</button></button>
                      </div>
                    <div>
                      <button><button className={`ml-4 text-gray-500 ${themeMode === 'light' ? 'hover:text-white':'hover:text-sky-400'}`} onClick={handleActiveTask}>Active</button></button>
                      </div>
                    <div>
                      <button><button className={`ml-4 text-gray-500 ${themeMode === 'light' ? 'hover:text-white':'hover:text-sky-400'}`} onClick={handleCompletedTask}>Completed</button></button>
                      </div>
                    <div>
                      <button><button className={`ml-56 max-sm:ml-0 text-gray-500 ${themeMode === 'light' ? 'hover:text-white':'hover:text-sky-400'}`} onClick={handleDeleteCompleted}>Clear Completed</button></button>
                    </div>
                </div>
              </div>
            </div>

        </div>
      </div>
    // </> 
  )
}

export default Home