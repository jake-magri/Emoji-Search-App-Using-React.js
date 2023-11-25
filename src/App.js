import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [emojis, setEmojis] = useState([]);
  const [displayedEmojis, setDisplayedEmojis] = useState([]);
  const [batchSize, setBatchSize] = useState(5);
  const [loading, setLoading] = useState(true);

  // API key for emoji data
  const apiKey = '84fac0f20066123921007d0d48bac464759a4647';

  // Event handler for search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Memoized function for fetching emojis, using useCallback to avoid infinite renders
  const fetchEmojis = useCallback(async () => {
    try {
      setLoading(true); // Set loading to true before fetching data.

      // Fetch emojis based on search query and API key
      const response = await axios.get(
        `https://emoji-api.com/emojis?search=${searchQuery}&access_key=${apiKey}`
      );

      if (Array.isArray(response.data)) {
        const filteredEmojis = filterEmojis(response.data, searchQuery);
        
        setEmojis(filteredEmojis);
        setDisplayedEmojis(filteredEmojis.slice(0, batchSize));
      } else {
        console.error('Invalid response format. Expected an array.');
      }
    } catch (error) {
      console.error('Error fetching emojis:', error);
    } finally {
      setLoading(false); // Set loading to false after data fetching.
    }
  }, [searchQuery, apiKey, batchSize]);

  // Function to filter emojis based on the search query
  const filterEmojis = (emojis, query) => {
    const filteredEmojis = emojis.filter((emoji) => {
      const emojiName = emoji.unicodeName.toLowerCase();
      const queryName = query.toLowerCase();
      return emojiName.includes(queryName);
    });
    return filteredEmojis;
  };

  // Event handler for search form submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchEmojis();
  };

  // Event handler for batch size change
  const handleBatchSizeChange = (event) => {
    setBatchSize(parseInt(event.target.value, 10));
  };

  // Fetch emojis on initial render
  useEffect(() => {
    fetchEmojis();
  }, [searchQuery, fetchEmojis]);

  // Update displayed emojis when batch size changes
  useEffect(() => {
    setDisplayedEmojis(emojis.slice(0, batchSize));
  }, [batchSize, emojis]);

  // JSX for rendering the app
  return (
    <div className="App">
      <h1>Emoji Search</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search emojis"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>
      <label>
        Batch Size:
        <select value={batchSize} onChange={handleBatchSizeChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </label>
      {loading ? (
        <p>Loading emojis...</p>
      ) : (
        <p>Displaying {displayedEmojis.length} of {emojis.length} emojis</p>
      )}
      {displayedEmojis.length > 0 ? (
        <ul>
          {displayedEmojis.map((emoji) => (
            <li key={emoji.slug}>
              <span>Emoji: </span>
              <span>{emoji.character}</span>
              <span> Name: </span>
              <span>{emoji.unicodeName}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No emojis found</p>
      )}
    </div>
  );
};

export default App;
