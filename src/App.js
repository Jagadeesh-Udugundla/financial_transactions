import React, { createContext, useState } from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Login from "./components/Login/Login.js"
import Register from './components/Register/Register.js'
import Expen from "./components/Expence/Expence.js"
import More from "./components/More/More.js"
import Month from "./components/Expence/Month.js"


const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' Component={Login}/>
        <Route path='/register' Component={Register}/>
        <Route path='/login' Component={Login}/>
        <Route path='/expence' Component={Expen}/>
        <Route path='/more' Component={More}/>
        <Route path='/addsalary' Component={Month}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App