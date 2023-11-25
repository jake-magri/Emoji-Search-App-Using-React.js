import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [emojis, setEmojis] = useState([]);
  const [displayedEmojis, setDisplayedEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(5);

  const apiKey = '84fac0f20066123921007d0d48bac464759a4647';

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchEmojis = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `https://emoji-api.com/emojis?search=${searchQuery}&access_key=${apiKey}`
      );

      if (Array.isArray(response.data)) {
        const filteredEmojis = filterEmojis(response.data, searchQuery);
        setEmojis(filteredEmojis);
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

  const filterEmojis = (emojis, query) => {
    const filteredEmojis = emojis.filter((emoji) => {
      const emojiName = emoji.unicodeName.toLowerCase();
      const queryName = query.toLowerCase();
      return emojiName.includes(queryName);
    });
    return filteredEmojis;
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchEmojis();
  };

  const handleShowMore = () => {
    setDisplayCount((prevCount) => Math.min(prevCount + 5, emojis.length));
  };

  const handleShowLess = () => {
    setDisplayCount((prevCount) => Math.max(prevCount - 5, 5));
  };

  useEffect(() => {
    fetchEmojis();
  }, [searchQuery, fetchEmojis]);

  useEffect(() => {
    setDisplayedEmojis(emojis.slice(0, displayCount));
  }, [displayCount, emojis]);

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
      {loading ? (
        <p>Loading emojis...</p>
      ) : (
        <div>
          <div>
          <p>
            Displaying {displayCount} of {emojis.length} emojis{' '}
          </p>
        </div>
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
          <p>
            <button onClick={handleShowMore}>Show More</button>{' '}
            <button onClick={handleShowLess}>Show Less</button>
          </p>
        </div>
      )}
      {displayedEmojis.length === 0 && <p>No emojis found</p>}
    </div>
  );
};

export default App;