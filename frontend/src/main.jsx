import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {Route,RouterProvider,createBrowserRouter,createRoutesFromElements} from 'react-router-dom'
import SignUp from './components/SignUp/SignUp.jsx'
import Login from './components/Login/Login.jsx'
 import Home from './components/Home/Home.jsx'

const router = createBrowserRouter(createRoutesFromElements(
  <Route>
    <Route path='/register' element={<SignUp/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
    <Route path='/home' element={<Home/>}></Route>
  </Route>
))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
