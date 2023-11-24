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
import TournamentList from "./components/View_match/TournamentList";
import Add_Team from "./components/Add_Team/Add_Team";
import Your_matches from "./components/Add_Team/Your_matches";
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
          <Route path="/" element={<Login setuser={setuser} />}></Route>
        </Routes>
        <Routes>
          <Route path="/Signup" element={<Signup></Signup>}></Route>
        </Routes>
        <Routes>
          <Route path="/Login" element={<Login setuser={setuser} />}></Route>
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
          <Route path="/Add_Team" element={<Add_Team />}></Route>
        </Routes>
        <Routes>
          <Route path="/Your_Matches" element={<Your_matches />}></Route>
        </Routes>
        <Routes>
          <Route path="/Scoring" element={<Scoring />}></Route >
        </Routes>
        <Routes>
          <Route path="/View_Matches" element={<TournamentList />}></Route >
        </Routes>
      </Router>
    </>
  )
}

export default App