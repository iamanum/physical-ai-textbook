import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './SearchBar.module.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const searchRef = useRef(null);
  const { colorMode } = useColorMode();
  const history = useHistory();
  const location = useLocation();
  
  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Extract query from URL for search results page
  useEffect(() => {
    if (location.pathname.includes('/search')) {
      const params = new URLSearchParams(location.search);
      const searchQuery = params.get('q');
      if (searchQuery) {
        setQuery(searchQuery);
        performSearch(searchQuery);
      }
    }
  }, [location]);
  
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v1/search/?q=${encodeURIComponent(searchQuery)}&limit=5`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data.results || []);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
      // Update URL to include search query
      history.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  const handleResultClick = (url) => {
    history.push(url);
    setShowResults(false);
    setQuery('');
  };
  
  return (
    <div className={styles['search-bar-container']} ref={searchRef}>
      <form onSubmit={handleSubmit} className={styles['search-form']}>
        <div className={styles['search-input-wrapper']}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowResults(true)}
            placeholder="Search textbook..."
            className={styles['search-input']}
          />
          <button
            type="submit"
            className={styles['search-button']}
            disabled={isLoading}
          >
            {isLoading ? '🔍' : '🔍'}
          </button>
        </div>
      </form>

      {showResults && (results.length > 0 || error) && (
        <div className={`${styles['search-results-dropdown']} ${styles[colorMode]}`}>
          {error ? (
            <div className={styles['search-error']}>{error}</div>
          ) : (
            <>
              <div className={styles['search-results-header']}>
                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </div>
              <ul className={styles['search-results-list']}>
                {results.map((result, index) => (
                  <li
                    key={result.id || index}
                    className={styles['search-result-item']}
                    onClick={() => handleResultClick(result.url)}
                  >
                    <div className={styles['result-title']}>{result.title}</div>
                    <div className={styles['result-excerpt']}>{result.excerpt}</div>
                    <div className={styles['result-relevance']}>
                      Relevance: {(result.relevance * 100).toFixed(1)}%
                    </div>
                  </li>
                ))}
              </ul>
              <div className={styles['search-results-footer']}>
                <a
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowResults(false);
                    history.push(`/search?q=${encodeURIComponent(query)}`);
                  }}
                >
                  View all results
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;