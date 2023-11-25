import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [emojis, setEmojis] = useState([]);
  const [displayedEmojis, setDisplayedEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(5);

  const apiKey = '84fac0f20066123921007d0d48bac464759a4647';

  // Event handler for search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Event handler for form submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Reset display count to default (5) or the maximum possible value below 5
    setDisplayCount(Math.min(5, emojis.length));
    fetchEmojis();
  };

  // Event handlers for "Show More" and "Show Less" buttons
  const handleShowMore = () => {
    // Increment display count, ensuring it doesn't exceed the total number of emojis
    setDisplayCount((prevCount) => Math.min(prevCount + 5, emojis.length));
  };

  const handleShowLess = () => {
    // Decrement display count, ensuring it doesn't go below 1
    setDisplayCount((prevCount) => Math.max(prevCount - 5, 1));
  };

  // Fetch emojis from the API
  const fetchEmojis = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `https://emoji-api.com/emojis?search=${searchQuery}&access_key=${apiKey}`
      );

      if (Array.isArray(response.data)) {
        // Filter and set the emojis based on the search query
        const filteredEmojis = filterEmojis(response.data, searchQuery);
        setEmojis(filteredEmojis);
        // Set displayed emojis based on the current display count
        setDisplayedEmojis(filteredEmojis.slice(0, displayCount));
      } else {
        console.error('Invalid response format. Expected an array.');
      }
    } catch (error) {
      console.error('Error fetching emojis:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, apiKey, displayCount]);

  // Function to filter emojis based on the search query
  const filterEmojis = (emojis, query) => {
    const filteredEmojis = emojis.filter((emoji) => {
      const emojiName = emoji.unicodeName.toLowerCase();
      const queryName = query.toLowerCase();
      return emojiName.includes(queryName);
    });
    return filteredEmojis;
  };

  // Fetch emojis on initial render and when search query changes
  useEffect(() => {
    fetchEmojis();
  }, [searchQuery, fetchEmojis]);

  // Update displayed emojis when display count or emojis change
  useEffect(() => {
    setDisplayedEmojis(emojis.slice(0, displayCount));
  }, [displayCount, emojis]);

  return (
    <div className="App">
      <h1>Emoji Search</h1>
      <form onSubmit={handleSearchSubmit}>
        {/* Search input */}
        <input
          type="text"
          placeholder="Search emojis"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {/* Search button */}
        <button type="submit">Search</button>
      </form>
      {/* Loading or Displaying emojis section */}
      {loading ? (
        <p>Loading emojis...</p>
      ) : (
        <div>
          {/* Display count and total emojis information */}
          <p>
            Displaying {Math.min(displayCount, emojis.length)} of {emojis.length} emojis{' '}
          </p>
          {/* Emoji list */}
          <ul>
            {displayedEmojis.map((emoji) => (
              <li key={emoji.slug}>
                {/* Individual emoji item */}
                <span>Emoji: </span>
                <span>{emoji.character}</span>
                <span> Name: </span>
                <span>{emoji.unicodeName}</span>
              </li>
            ))}
          </ul>
          {/* Show More and Show Less buttons */}
          <p>
            <button onClick={handleShowMore}>Show More</button>{' '}
            <button onClick={handleShowLess}>Show Less</button>
          </p>
        </div>
      )}
      {/* No emojis found message */}
      {displayedEmojis.length === 0 && <p>No emojis found</p>}
    </div>
  );
};

export default App;
