import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// ✅ Route 1: Get popular movies
router.get("/popular", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch movies from TMDB" });
  }
});

// ✅ Route 2: Search for movies (improved)
router.get("/search", async (req, res) => {
  const query = req.query.query; // Example: ?query=Batman
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    let allResults = [];

    // Fetch multiple pages for more results
    for (let page = 1; page <= 5; page++) {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=${page}&include_adult=false`
      );
      const data = await response.json();

      if (data.results) {
        allResults = [...allResults, ...data.results];
      } else {
        break;
      }
    }

    res.json({ results: allResults });
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ message: "Failed to search movies" });
  }
});
// ✅ Route 3: Get single movie details + trailer
router.get("/:id", async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).json({ message: "Failed to fetch movie details" });
  }
});


// ✅ Route 3: Get movie details + trailer
router.get("/:id", async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).json({ message: "Failed to fetch movie details" });
  }
});


export default router;
