
import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Admin_App from './admincomponents/adminApp'
import './admincomponents/adminstyles.css'
import Bytes from './module_pages/bytes_page'
import Missions from './module_pages/missions_page'
import Profile from './module_pages/profile_page'
import Leaderboard from './module_pages/leaderboard_page'
import Loyalty from './module_pages/loyalty_page'
import Register from "./module_pages/sign_in_page";



function App() {
  return (
    <Router>
      <div className="app-container">
      
        <Routes>
          <Route path="/" element={<Bytes />} />
          <Route path="/bytes" element={<Bytes />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/admin-app" element={<Admin_App />} />
          <Route path="/register" element={<Register />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
