import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import Index from './components/index/Index';
import Login from './components/user/loginpage/Login';
import Signup from './components/user/signup/Signup';
import Dashboard from './components/user/dashboard/Dashboard';
import Profile from './components/user/profile/Profile';
import Home from './components/admin/index/Index';
import Cart from './components/user/cart/cart';
import ProductDetails from './components/user/productDetails/productDetails';
import CheckoutPage from './components/user/checkout/Checkout';
import SuccessPage from './components/stripePages/SuccessPage';

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<Index/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path="/dashboard/:profileId" element={<Dashboard />} />
          <Route path='/profile/:profileId' element={<Profile/>}/>
          <Route path='/admin/:id' element={<Home/>}/>
          <Route path='/cart/:profileId' element={<Cart/>}/>
          <Route path="/productDetails/:profileId/:productId" element={<ProductDetails />} />
          <Route path="/checkout/:productId" element={<CheckoutPage />} />
          <Route path="/success/:session_id" element={<SuccessPage/>} />
        </Routes>
      </Router>
    </div>
   
    
  );
}

export default App;
