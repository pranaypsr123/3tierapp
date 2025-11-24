import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import ActorCard from '../components/ActorCard';

const Home = () => {
  const [latestMovies, setLatestMovies] = useState([]);
  const [popularActors, setPopularActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesRes, actorsRes] = await Promise.all([
          axios.get('/movies/latest'),
          axios.get('/actors/popular')
        ]);
        setLatestMovies(moviesRes.data);
        setPopularActors(actorsRes.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to Telugu Cinema World</h2>
          <p>Your complete guide to Telugu movies, actors, and cinema news</p>
        </div>
      </section>

      <section>
        <h2 className="section-title">Latest Movies</h2>
        <div className="movie-grid">
          {latestMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Popular Actors</h2>
        <div className="cast-container">
          {popularActors.map(actor => (
            <ActorCard key={actor.id} actor={actor} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;