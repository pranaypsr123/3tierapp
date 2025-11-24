import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <img 
        src={movie.poster_url || `https://via.placeholder.com/300x400/cccccc/333333?text=${encodeURIComponent(movie.title)}`} 
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-info">
        <Link to={`/movies/${movie.id}`}>
          <h3 className="movie-title">{movie.title}</h3>
        </Link>
        <p className="movie-year">{movie.release_year} • {movie.genre}</p>
        <div className="movie-rating">
          {'★'.repeat(Math.floor(movie.rating))}
          {movie.rating % 1 >= 0.5 && '½'}
          <span> {movie.rating}/5</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;