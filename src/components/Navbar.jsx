import React from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-brand">Activity Tracker</div>
        <div className="nav-links">
          <a href="https://obaroindustries.com" target="_blank" rel="noopener noreferrer">Obaro Industries</a>
          <a href="https://x.com/yourhandle" target="_blank" rel="noopener noreferrer">X Profile</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 