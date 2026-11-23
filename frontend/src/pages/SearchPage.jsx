import { useState } from "react";
import api from "../utils/api.js";
import Navbar from "../components/Navbar.jsx";
import { Plus, Search } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // Search item based on user's query
  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Call backend api
      const response = await api.get(`/search?query=${encodeURIComponent(query)}`);

      // Parse data
      const data = await response.data;

      // Convert media type to match backend structure
      const formattedData = data.map((item) => ({
        ...item,
        media_type: item.media_type === "tv" ? "show" : item.media_type,
      }));

      // Store results
      setResults(formattedData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Add search result to watchlist
  const handleAddToWatchlist = async (tmdbId, mediaType) => {
    try {
      // Call backend api
      await api.post('/watchlist', {tmdb_id: tmdbId, type: mediaType}); 

      alert("Successfully added to watchlist!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="search-container">
      <Navbar />

      <h1>SEARCH</h1>

      <div className="search-form">
        <form onSubmit={handleSearch}>
          <input type="text" onChange={(e) => setQuery(e.target.value)} />
          <button type="submit">
            <Search />
          </button>
        </form>
      </div>

      <div className="search-results-container">
        {results.length === 0 ? (
          <div className="empty-results-msg">
            <p>Search for your next title!</p>
          </div>
        ) : (
          results.map((item) => (
            <div key={item.id} className="result-card">
              <div className="result-img-container">
                {item.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.name}
                  />
                )}
              </div>
              <div className="result-details">
                <span className="result-title">{item.name || item.title}</span>
                <span className="result-year">{` (${(
                  item.first_air_date || item.release_date
                )?.slice(0, 4)})`}</span>
                <p className="result-header">Overview</p>
                <p className="result-overview">{item.overview}</p>
                <button
                  className="result-add-btn"
                  onClick={() => handleAddToWatchlist(item.id, item.media_type)}
                >
                  <Plus 
                    strokeWidth={3}
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
