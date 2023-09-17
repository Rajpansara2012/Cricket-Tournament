import Signup from "./components/Signup/Signup"
import Login from "./components/Login/Login"
import Admin_home from "./components/Home/Admin_home"
import User_home from "./components/Home/User_home"

import "./App.css";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Add_Tournament from "./components/Home/Add_Tournament";
import Add_match from "./components/Addmatch/Add_match";
import Navbar from "./components/Navbar/Navbar";
import Logout from "./components/Logout/Logout";
function App() {

  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
        </Routes>
        <Routes>
          <Route path="/Signup" element={<Signup></Signup>}></Route>
        </Routes>
        <Routes>
          <Route path="/Login" element={<Login></Login>}></Route>
        </Routes>
        <Routes>
          <Route path="/Logout" element={<Logout />}></Route>
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
      </Router>
    </>
  )
}

export default App
