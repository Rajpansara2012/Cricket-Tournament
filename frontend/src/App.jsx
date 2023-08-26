import Signup from "./components/Signup/Signup"
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/Signup" element={<Signup></Signup>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
