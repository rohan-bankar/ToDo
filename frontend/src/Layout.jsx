import React, { useEffect, useState } from 'react'
import Header from './components/Header/Header'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import { ThemeProvider } from './context/Theme'
function Layout() {
const[themeMode,setThemeMode] = useState("dark")
const lightTheme = () =>{
    setThemeMode("light")
}

const darkTheme = () =>{
    setThemeMode("dark")
}

const toggle = () =>{
    if(themeMode === 'dark'){
        lightTheme()
    }else{
        darkTheme()
    }
}

useEffect(()=>{
    document.querySelector('html').classList.remove("dark","light")
    document.querySelector('html').classList.add(themeMode)
},[themeMode])

  return (
    <ThemeProvider value={{themeMode,lightTheme,darkTheme}}>
        <>
            <Header toggleTheme={toggle}/>
            <Outlet/>
            {/* <Footer/> */}
        </>
    </ThemeProvider>
  )
}

export default Layout