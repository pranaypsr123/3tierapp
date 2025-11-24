import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
let db;
async function initializeDatabase() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      release_year INTEGER,
      genre TEXT,
      director TEXT,
      duration INTEGER,
      rating REAL,
      poster_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS actors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      bio TEXT,
      date_of_birth DATE,
      photo_url TEXT,
      role TEXT DEFAULT 'Actor',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS movie_cast (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER,
      actor_id INTEGER,
      character_name TEXT,
      FOREIGN KEY (movie_id) REFERENCES movies (id),
      FOREIGN KEY (actor_id) REFERENCES actors (id)
    );
  `);

  // Insert sample data
  const movieCount = await db.get('SELECT COUNT(*) as count FROM movies');
  if (movieCount.count === 0) {
    await insertSampleData();
  }
}

// Insert sample data
async function insertSampleData() {
  // Insert movies
  const movies = [
    {
      title: 'Pushpa 2: The Rule',
      description: 'The continuation of Pushpa Raj\'s story in the red sandalwood smuggling world.',
      release_year: 2023,
      genre: 'Action, Thriller',
      director: 'Sukumar',
      duration: 180,
      rating: 4.5,
      poster_url: 'https://via.placeholder.com/300x400/ff9933/ffffff?text=Pushpa+2'
    },
    {
      title: 'Salaar: Part 1 - Ceasefire',
      description: 'A story of two friends who become bitter enemies in the criminal underworld.',
      release_year: 2023,
      genre: 'Action, Drama',
      director: 'Prashanth Neel',
      duration: 175,
      rating: 4.2,
      poster_url: 'https://via.placeholder.com/300x400/138808/ffffff?text=Salaar'
    },
    {
      title: 'HanuMan',
      description: 'A superhero film based on Hindu mythology featuring Lord Hanuman.',
      release_year: 2024,
      genre: 'Superhero, Action',
      director: 'Prasanth Varma',
      duration: 158,
      rating: 4.7,
      poster_url: 'https://via.placeholder.com/300x400/3333ff/ffffff?text=HanuMan'
    }
  ];

  for (const movie of movies) {
    await db.run(
      `INSERT INTO movies (title, description, release_year, genre, director, duration, rating, poster_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [movie.title, movie.description, movie.release_year, movie.genre, movie.director, movie.duration, movie.rating, movie.poster_url]
    );
  }

  // Insert actors
  const actors = [
    {
      name: 'Prabhas',
      bio: 'Known as the Rebel Star, famous for Baahubali series.',
      date_of_birth: '1979-10-23',
      photo_url: 'https://via.placeholder.com/200x250/cccccc/333333?text=Prabhas',
      role: 'Actor'
    },
    {
      name: 'Allu Arjun',
      bio: 'Stylish Star known for his unique dance moves and acting.',
      date_of_birth: '1982-04-08',
      photo_url: 'https://via.placeholder.com/200x250/cccccc/333333?text=Allu+Arjun',
      role: 'Actor'
    },
    {
      name: 'Ram Charan',
      bio: 'Megastar known for his powerful performances.',
      date_of_birth: '1985-03-27',
      photo_url: 'https://via.placeholder.com/200x250/cccccc/333333?text=Ram+Charan',
      role: 'Actor'
    }
  ];

  for (const actor of actors) {
    await db.run(
      `INSERT INTO actors (name, bio, date_of_birth, photo_url, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [actor.name, actor.bio, actor.date_of_birth, actor.photo_url, actor.role]
    );
  }

  // Insert movie cast relationships
  const movieCast = [
    { movie_id: 1, actor_id: 2, character_name: 'Pushpa Raj' },
    { movie_id: 2, actor_id: 1, character_name: 'Salaar' },
    { movie_id: 3, actor_id: 3, character_name: 'Hanuman' }
  ];

  for (const cast of movieCast) {
    await db.run(
      `INSERT INTO movie_cast (movie_id, actor_id, character_name) VALUES (?, ?, ?)`,
      [cast.movie_id, cast.actor_id, cast.character_name]
    );
  }
}

// Routes

// Get all movies
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await db.all('SELECT * FROM movies ORDER BY release_year DESC');
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Get latest movies
app.get('/api/movies/latest', async (req, res) => {
  try {
    const movies = await db.all('SELECT * FROM movies ORDER BY release_year DESC LIMIT 4');
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest movies' });
  }
});

// Get movie by ID
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await db.get('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Get cast for this movie
    const cast = await db.all(`
      SELECT a.*, mc.character_name 
      FROM actors a 
      JOIN movie_cast mc ON a.id = mc.actor_id 
      WHERE mc.movie_id = ?
    `, [req.params.id]);

    res.json({ ...movie, cast });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

// Get all actors
app.get('/api/actors', async (req, res) => {
  try {
    const actors = await db.all('SELECT * FROM actors ORDER BY name');
    res.json(actors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch actors' });
  }
});

// Get popular actors
app.get('/api/actors/popular', async (req, res) => {
  try {
    const actors = await db.all('SELECT * FROM actors LIMIT 6');
    res.json(actors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular actors' });
  }
});

// Get actor by ID
app.get('/api/actors/:id', async (req, res) => {
  try {
    const actor = await db.get('SELECT * FROM actors WHERE id = ?', [req.params.id]);
    
    if (!actor) {
      return res.status(404).json({ error: 'Actor not found' });
    }

    // Get movies for this actor
    const movies = await db.all(`
      SELECT m.*, mc.character_name 
      FROM movies m 
      JOIN movie_cast mc ON m.id = mc.movie_id 
      WHERE mc.actor_id = ?
    `, [req.params.id]);

    res.json({ ...actor, movies });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch actor' });
  }
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const movies = await db.all(
      'SELECT * FROM movies WHERE title LIKE ? OR genre LIKE ?',
      [`%${q}%`, `%${q}%`]
    );

    const actors = await db.all(
      'SELECT * FROM actors WHERE name LIKE ?',
      [`%${q}%`]
    );

    res.json({ movies, actors });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});