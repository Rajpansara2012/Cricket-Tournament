import Signup from "./components/Signup/Signup"
import Login from "./components/Login/Login"
import Admin_home from "./components/Home/Admin_home"
import User_home from "./components/Home/User_home"
import React, { useEffect, useState } from 'react';
import "./App.css";
import Cookies from 'js-cookie';
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate, Link } from "react-router-dom";

import Add_Tournament from "./components/Home/Add_Tournament";
import Add_match from "./components/Match_handling/Add_match";
import Navbar from "./components/Navbar/Navbar";
import Logout from "./components/Logout/Logout";
import Scoring from "./components/Match_handling/Scoring";
import TournamentList from "./components/View_match/TournamentList";
import Add_Team from "./components/Add_Team/Add_Team";
import Your_matches from "./components/Add_Team/Your_matches";
import Profile from "./components/Player_profile/Profile";
import Footer from "./components/footer/Footer";
import UpdateTeam from "./components/Update-Team/Update-Team";



function App() {

  const isUser = () => {
    const userfind = Cookies.get('token');
    const usertype = Cookies.get('user_type');
    console.log(userfind)
    return userfind !== undefined && usertype === 'user';
  };
  const isAdmin = () => {
    const userfind = Cookies.get('token');
    const usertype = Cookies.get('user_type');
    console.log(userfind)
    return userfind !== undefined && usertype === 'admin';
  };
  const isLogged = () => {
    const userfind = Cookies.get('token');
    const usertype = Cookies.get('user_type');
    console.log(userfind)
    return userfind !== undefined && usertype !== undefined;
  };
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
    <div className="bg-gray-100">
      <div className="flex flex-col min-h-screen ">
        <Navbar usertype={usertype} username={Cookies.get('username')}> </Navbar>
        <Router> {/* Wrap App component with Router */}
          <Routes>
            <Route path="/" element={<Navigate to="/Login" replace />} />
            <Route path="/Signup" element={!isLogged() ? <Signup /> : <Navigate to="/Login" replace />} />

            <Route path="/Login" element={!isLogged() ? <Login setuser={setuser} /> : <Navigate to={usertype === 'admin' ? '/Admin_home' : '/User_home'} replace />} />

            <Route path="/Logout" element={<Logout setuser={setuser} />} />

            <Route path="/Admin_home" element={isAdmin() ? <Admin_home /> : <Navigate to="/Login" replace />} />
            <Route path="/Add_Tournament" element={isAdmin() ? <Add_Tournament /> : <Navigate to="/Login" replace />} />
            <Route path="/Add_match" element={isAdmin() ? <Add_match /> : <Navigate to="/Login" replace />} />
            <Route path="/Scoring" element={isAdmin() ? <Scoring /> : <Navigate to="/Login" replace />} />
            <Route path="/View_Matches" element={isAdmin() ? <TournamentList /> : <Navigate to="/Login" replace />} />
            <Route path="/User_home" element={isUser() ? <User_home /> : <Navigate to="/Login" replace />} />
            <Route path="/Add_Team" element={isUser() ? <Add_Team /> : <Navigate to="/Login" replace />} />
            <Route path="/Your_Matches" element={isUser() ? <Your_matches /> : <Navigate to="/Login" replace />} />
            <Route path="/Profile" element={isUser() ? <Profile /> : <Navigate to="/Login" replace />} />
            {/* Use Navigate component for conditional routing */}
            <Route
              path="/Update-Team"
              element={isUser() ? <UpdateTeam /> : <Navigate to="/Login" replace />}
            />
          </Routes>
        </Router>
        <Footer />
      </div>
    </div>
  )
}

export default App