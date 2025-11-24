import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Actors from './pages/Actors';
import MovieDetail from './pages/MovieDetail';
import ActorDetail from './pages/ActorDetail';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:3001/api';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/actors/:id" element={<ActorDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;