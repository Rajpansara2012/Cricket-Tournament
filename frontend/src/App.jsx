import Signup from "./components/Signup/Signup"
import Login from "./components/Login/Login"
import "./App.css";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
function App() {


  return (
    <>

      <Router>
        <Routes>
          <Route path="/Signup" element={<Signup></Signup>}></Route>
        </Routes>
        <Routes>
          <Route path="/Login" element={<Login></Login>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
