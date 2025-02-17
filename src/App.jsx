import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/auth_context';
import ProtectedRoute from '../src/context/protected_route';
import './admincomponents/adminstyles.css';
import React from "react";
import './App.css';

import Admin_App from './admincomponents/adminApp';
import Bytes from './module_pages/bytes_page';
import Missions from './module_pages/missions_page';
import Profile from './module_pages/profile_page';
import Leaderboard from './module_pages/leaderboard_page';
import Loyalty from './module_pages/loyalty_page';
import Register from "./module_pages/sign_in_page";
import Landing from "./module_pages/landing";
import Unauthorized from "./module_pages/unauthoruized";

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <Helmet>
        <title>Web3 Education Platform | Learn, Explore, and Grow</title>
        <meta
          name="description"
          content="Explore our Social Web3 education platform to learn free about blockchain, crypto, DeFi, DAO's and more through engaging missions and bytes."
        />
        <meta
          name="keywords"
          content="Web3, blockchain, crypto, education, missions, bytes, decentralized technologies, work experience, community, meetups"
        />
        <meta property="og:title" content="Learn web3 free, get verifiable experience" />
        <meta property="og:description" content="Learn wevb3 and unlock your next mission" />
        <meta property="og:image" content="https://example.com/default-og-image.jpg" />
        <meta property="og:url" content="https://example.com" />
        <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
        
        <Router>
          <div className="app-container">
          <Routes>
              {/* Public routes - no protection needed */}
              <Route path="/" element={<Navigate to="/bytes" />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/bytes" element={<Bytes />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/dashboard" element={<Profile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/loyalty" element={<Loyalty />} />
              <Route path="/bytes/:slug" element={<Landing />} />
              <Route path="/missions/:slug" element={<Landing />} />
              
              {/* Only protected route - admin page */}
              <Route path="/admin-app" element={
                <ProtectedRoute role="admin">
                  <Admin_App />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </div>
        </Router>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
