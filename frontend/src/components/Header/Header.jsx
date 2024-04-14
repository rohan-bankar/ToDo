import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { faSun } from '@fortawesome/free-regular-svg-icons'
library.add(faMoon,faSun)
import useTheme from '../../context/Theme'
import { useState } from 'react'
function Header({toggleTheme}) {
    const {themeMode} = useTheme()

    const lightThemeColor = 'rgb(224 231 255)'
    const darkThemeColor = 'hsl(235, 24%, 19%)'

    const backgroundColor = themeMode === 'light' ? darkThemeColor : lightThemeColor
  return (
    <header className='shadow sticky z-50 top-0'>
        <nav style={{backgroundColor}} className={`px-6 py-4  border-bottom border-gray-300`}>
            <div className='relative'>
                <h1 className={`text-xl font-bold  ${themeMode === 'light' ? 'text-white' : 'text-black'}`}>T O D O</h1>
                <button className={`absolute right-5 top-1 ${themeMode === 'light' ? 'text-white' : 'text-black'}`} onClick={toggleTheme}>
                   {themeMode === 'dark' ?<FontAwesomeIcon icon="fa-regular fa-sun" size="xl" /> : <FontAwesomeIcon icon="fa-solid fa-moon" size='xl' />}           
                </button>
            </div>
        </nav>
    </header>
  )
}

export default Header