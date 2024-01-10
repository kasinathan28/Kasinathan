import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import Index from './components/index/Index';
import Login from './components/user/loginpage/Login';
import Signup from './components/user/signup/Signup';
import Dashboard from './components/user/dashboard/Dashboard';
import Profile from './components/user/profile/Profile';
import Home from './components/admin/index/Index';

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<Index/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/admin' element={<Home/>}/>
        </Routes>
      </Router>

    </div>
   
    
  );
}

export default App;
