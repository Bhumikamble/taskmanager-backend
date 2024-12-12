import React from 'react';

function Header({ onLogout }) {
  return (
    <header className="header">
      <h1>Task Manager</h1>
      <button onClick={onLogout} className="logout-button">Logout</button>
    </header>
  );
}

export default Header;
