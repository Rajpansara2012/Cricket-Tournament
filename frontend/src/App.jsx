import Signup from "./components/Signup/Signup"
import Login from "./components/Login/Login"
import Admin_home from "./components/Home/Admin_home"
import User_home from "./components/Home/User_home"
import React, { useEffect, useState } from 'react';
import "./App.css";
import Cookies from 'js-cookie';
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Add_Tournament from "./components/Home/Add_Tournament";
import Add_match from "./components/Match_handling/Add_match";
import Navbar from "./components/Navbar/Navbar";
import Logout from "./components/Logout/Logout";
import Scoring from "./components/Match_handling/Scoring";
function App() {
  const [usertype, setusertype] = useState('');
  useEffect(() => {
    const userfind = Cookies.get('user_type');
    if (userfind == 'admin') {
      setusertype('admin')
    }
    else if (userfind == 'user') {
      setusertype('user')
    }
  }, []);
  
  const setuser = (type) => {
    setusertype(type);
  }
  console.log(usertype)
  return (
    <>
      < Navbar usertype={usertype}> </Navbar>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
        </Routes>
        <Routes>
          <Route path="/Signup" element={<Signup></Signup>}></Route>
        </Routes>
        <Routes>
          <Route path="/Login" element={<Login setuser={setuser}></Login>}></Route>
        </Routes>
        <Routes>
          <Route path="/Logout" element={<Logout setuser={setuser}></Logout>}></Route>
        </Routes>
        <Routes>
          <Route path="/Admin_home" element={<Admin_home />}></Route>
        </Routes>
        <Routes>
          <Route path="/User_home" element={<User_home />}></Route>
        </Routes>
        <Routes>
          <Route path="/Add_Tournament" element={<Add_Tournament />}></Route>
        </Routes>
        <Routes>
          <Route path="/Add_match" element={<Add_match />}></Route>
        </Routes>
        <Routes>
          <Route path="/Scoring" element={<Scoring />}></Route >
        </Routes>
      </Router>
    </>
  )
}

export default App
