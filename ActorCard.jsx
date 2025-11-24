import React from 'react';
import { Link } from 'react-router-dom';

const ActorCard = ({ actor }) => {
  return (
    <div className="cast-card">
      <img 
        src={actor.photo_url || `https://via.placeholder.com/200x250/cccccc/333333?text=${encodeURIComponent(actor.name)}`}
        alt={actor.name}
        className="cast-photo"
      />
      <div className="cast-info">
        <Link to={`/actors/${actor.id}`}>
          <h4 className="cast-name">{actor.name}</h4>
        </Link>
        <p className="cast-role">{actor.role || 'Actor'}</p>
      </div>
    </div>
  );
};

export default ActorCard;