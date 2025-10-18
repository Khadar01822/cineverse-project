import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "https://cineverse-project-oqs7.onrender.com/api/movies";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("Popular Movies");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const fetchPopularMovies = async () => {
    try {
      const res = await axios.get(`${API_BASE}/popular`);
      setMovies(res.data.results);
      setTitle("Popular Movies");
    } catch (err) {
      console.error("Error fetching popular movies:", err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return fetchPopularMovies();

    try {
      const res = await axios.get(`${API_BASE}/search?query=${encodeURIComponent(searchQuery)}`);
      setMovies(res.data.results);
      setTitle(`Search Results for "${searchQuery}"`);
    } catch (err) {
      console.error("Error searching movies:", err);
    }
  };

  const handleMovieClick = async (movieId) => {
    try {
      const res = await axios.get(`${API_BASE}/${movieId}`);
      setSelectedMovie(res.data);

      const trailer = res.data.videos?.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      setTrailerKey(trailer ? trailer.key : "");
    } catch (err) {
      console.error("Error fetching movie details:", err);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setTrailerKey("");
  };

  return (
    <div className="movies-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <h2>{title}</h2>

      <div className="movies-container">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie.id)}>
            <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-rating">⭐ {movie.vote_average}</p>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div className="movie-modal" onClick={closeModal}>
          <div className="movie-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>✖</button>
            <img
              src={`https://image.tmdb.org/t/p/w400${selectedMovie.poster_path}`}
              alt={selectedMovie.title}
              className="modal-poster"
            />
            <h2>{selectedMovie.title}</h2>
            <p><strong>⭐ Rating:</strong> {selectedMovie.vote_average}</p>
            <p>{selectedMovie.overview}</p>

            {trailerKey ? (
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="YouTube Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <p>No trailer available.</p>
            )}
          </div>
        </div>
      )}

      <footer>
        <p>Published by <strong>Khadar</strong></p>
      </footer>
    </div>
  );
}

export default Movies;
