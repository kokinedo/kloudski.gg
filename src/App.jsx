import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Profile from './components/Profile';
import ActivityDashboard from './components/ActivityDashboard';
import MovingBanner from './components/MovingBanner';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="main-content">
          <Profile />
          <MovingBanner />
          <ActivityDashboard />
        </div>
      </div>
    </Router>
  );
}

export default App; 