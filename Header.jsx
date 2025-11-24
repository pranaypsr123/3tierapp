import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="container header-content">
        <div className="logo">
          <h1>Telugu Cinema World</h1>
        </div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/actors">Actors</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;