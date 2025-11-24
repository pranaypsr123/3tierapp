-- Additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_movies_year ON movies(release_year);
CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies(genre);
CREATE INDEX IF NOT EXISTS idx_actors_name ON actors(name);
CREATE INDEX IF NOT EXISTS idx_movie_cast_movie ON movie_cast(movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_cast_actor ON movie_cast(actor_id);

-- Views for common queries
CREATE VIEW IF NOT EXISTS movie_details AS
SELECT 
  m.*,
  GROUP_CONCAT(DISTINCT a.name) as actor_names,
  GROUP_CONCAT(DISTINCT a.photo_url) as actor_photos
FROM movies m
LEFT JOIN movie_cast mc ON m.id = mc.movie_id
LEFT JOIN actors a ON mc.actor_id = a.id
GROUP BY m.id;

CREATE VIEW IF NOT EXISTS actor_filmography AS
SELECT 
  a.*,
  COUNT(mc.movie_id) as movie_count,
  GROUP_CONCAT(DISTINCT m.title) as movie_titles
FROM actors a
LEFT JOIN movie_cast mc ON a.id = mc.actor_id
LEFT JOIN movies m ON mc.movie_id = m.id
GROUP BY a.id;