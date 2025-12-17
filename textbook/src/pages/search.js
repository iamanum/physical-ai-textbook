import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import Layout from '@theme/Layout';
import SearchBar from '@site/src/components/SearchBar';

const SearchPage = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Extract query from URL when the page loads
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [location]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/search/?q=${encodeURIComponent(searchQuery)}&limit=20`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    performSearch(newQuery);
  };

  return (
    <Layout title="Search Results" description="Search results for the Physical AI & Humanoid Robotics textbook">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset--2">
            <h1>Search Results</h1>
            
            <div className="search-controls margin-bottom--lg">
              <SearchBar />
            </div>
            
            {isLoading ? (
              <div className="text--center padding--lg">
                <div className="loading-spinner">🔍 Searching...</div>
              </div>
            ) : error ? (
              <div className="alert alert--error">
                <p>{error}</p>
              </div>
            ) : (
              <div>
                {query && (
                  <p className="margin-bottom--lg">
                    Found <strong>{searchResults.length}</strong> result{searchResults.length !== 1 ? 's' : ''} for "<strong>{query}</strong>"
                  </p>
                )}
                
                {searchResults.length > 0 ? (
                  <div className="search-results-list">
                    {searchResults.map((result, index) => (
                      <div key={result.id || index} className="search-result-card margin-bottom--md">
                        <h3>
                          <a href={result.url} className="search-result-link">
                            {result.title}
                          </a>
                        </h3>
                        <p className="search-result-excerpt">
                          {result.excerpt}
                        </p>
                        <div className="search-result-meta">
                          <span className="search-result-relevance">
                            Relevance: {(result.relevance * 100).toFixed(1)}%
                          </span>
                          <span className="search-result-url">→ {result.url}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : query ? (
                  <div className="text--center padding--lg">
                    <p>No results found for "{query}". Try different keywords.</p>
                  </div>
                ) : (
                  <div className="text--center padding--lg">
                    <p>Enter a search query to find content in the textbook.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;