import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add JSON parsing middleware
  app.use(express.json());

  // API Proxy Route for TMDB
  // Handles endpoints like: /api/tmdb/search/movie?query=batman
  // and /api/tmdb/movie/popular
  app.get("/api/tmdb/*", async (req, res) => {
    if (!TMDB_API_KEY) {
      return res.status(500).json({ error: "TMDB_API_KEY is not configured on the server." });
    }

    try {
      const endpoint = req.params[0];
      const queryParams = new URLSearchParams(req.query as Record<string, string>);
      
      // Add required TMDB parameters
      queryParams.append('api_key', TMDB_API_KEY);
      
      const tmdbUrl = `${TMDB_BASE_URL}/${endpoint}?${queryParams.toString()}`;
      
      const response = await fetch(tmdbUrl);
      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      
      res.json(data);
    } catch (error: any) {
      console.error("Error communicating with TMDB", error);
      res.status(500).json({ error: "Failed to communicate with TMDB" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
