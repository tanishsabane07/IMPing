import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from '@/config/api';
import InternshipCard from '@/components/ui/internship_card';
import { ArrowLeft, CalendarClock, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './search_results.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("deadline-asc");
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  // Extract search query from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = (queryParams.get("query") || "").trim();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/register/login");
      return;
    }

    if (!searchQuery) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    
    const fetchResults = async () => {
      try {
        const response = await axios.get(getApiUrl(`/internships/search?query=${encodeURIComponent(searchQuery)}`), {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError(error.response?.data?.message || "Could not load search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery, navigate]);

  const filteredResults = useMemo(() => {
    let result = [...searchResults];

    if (showActiveOnly) {
      const now = new Date();
      result = result.filter((internship) => {
        if (!internship.deadline) return true;
        return new Date(internship.deadline) >= now;
      });
    }

    if (sortBy === "deadline-asc") {
      result.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0));
    }

    if (sortBy === "deadline-desc") {
      result.sort((a, b) => new Date(b.deadline || 0) - new Date(a.deadline || 0));
    }

    if (sortBy === "stipend-desc") {
      result.sort((a, b) => (Number(b.stipend) || 0) - (Number(a.stipend) || 0));
    }

    if (sortBy === "company-asc") {
      result.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
    }

    return result;
  }, [searchResults, sortBy, showActiveOnly]);

  return (
    <div className="search-shell">
      <div className="search-noise" aria-hidden="true" />
      <div className="search-container">
        <div className="search-topbar reveal delay-1">
          <Button variant="ghost" className="search-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="search-head reveal delay-1">
          <div>
            <p className="search-kicker">
              <Sparkles size={15} />
              Internship Search
            </p>
            <h1>Results for "{searchQuery || '...'}"</h1>
            <p>{filteredResults.length} opportunities matched your query.</p>
          </div>
          <article className="search-stat">
            <CalendarClock size={16} />
            <span>{filteredResults.length}</span>
            <small>Visible results</small>
          </article>
        </div>

        <div className="search-controls reveal delay-2">
          <div className="search-query-chip">
            <Search size={14} />
            {searchQuery || 'No query entered'}
          </div>

          <div className="search-control-group">
            <label>
              Sort
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="deadline-asc">Deadline: earliest</option>
                <option value="deadline-desc">Deadline: latest</option>
                <option value="stipend-desc">Stipend: high to low</option>
                <option value="company-asc">Company: A-Z</option>
              </select>
            </label>
            <label className="search-toggle-label">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
              />
              Active only
            </label>
          </div>
        </div>

        {loading ? (
          <div className="search-loading">
            <div className="search-loader" />
            <p>Loading search results...</p>
          </div>
        ) : error ? (
          <div className="search-empty">
            <p>{error}</p>
            <Button onClick={() => navigate(0)}>Retry</Button>
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="search-grid reveal delay-2">
            {filteredResults.map((internship) => (
              <InternshipCard key={internship._id} {...internship} />
            ))}
          </div>
        ) : (
          <div className="search-empty reveal delay-2">
            <p>No results found.</p>
            <span>Try a broader keyword or disable the active-only filter.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;