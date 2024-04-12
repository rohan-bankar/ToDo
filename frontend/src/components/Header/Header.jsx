import React from 'react'
import useTheme from '../../context/Theme'
import { useState } from 'react'
function Header({toggleTheme}) {
    const {themeMode} = useTheme()

  return (
    <header className='shadow sticky z-50 top-0'>
        <nav style={{backgroundColor:'hsl(235, 24%, 19%)'}} className={`px-6 py-4 border-bottom border-gray-300`}>
            <div className='relative'>
                <h1 className='text-xl font-bold text-white'>T O D O</h1>
                <button className={`absolute right-5 top-1`} onClick={toggleTheme}>
                   {themeMode === 'dark' ? <img src="/icon-moon.svg" alt="" />:<img src="/icon-sun.svg" alt="" />}           
                </button>
            </div>
        </nav>
    </header>
  )
}

export default Header