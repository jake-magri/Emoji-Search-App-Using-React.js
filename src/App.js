import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryInput, setSearchQueryInput] = useState('');
  const [emojis, setEmojis] = useState([]);
  const [displayedEmojis, setDisplayedEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(5);
  const [error, setError] = useState(null);

  const apiKey = '84fac0f20066123921007d0d48bac464759a4647';

  const handleSearchChange = (event) => {
    setSearchQueryInput(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
  event.preventDefault();
  setSearchQuery(searchQueryInput);
};

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let apiUrl = `https://emoji-api.com/emojis?access_key=${apiKey}`;

      if (searchQuery.trim() !== '') {
        apiUrl += `&search=${searchQuery}`;
      }

      const response = await axios.get(apiUrl);

      console.log('API Response:', response.data);
      console.log('Search Query:', searchQuery);

      if (Array.isArray(response.data)) {
        const filteredEmojis = filterEmojis(response.data, searchQuery);
        console.log('Filtered Emojis:', filteredEmojis);

        if (filteredEmojis.length === 0) {
          console.error('No emojis found.');
          setEmojis([]);
          setDisplayedEmojis([]);
          setError('No emojis found.');
        } else {
          setEmojis(filteredEmojis);
          setDisplayedEmojis(filteredEmojis.slice(0, displayCount));
        }
      } else {
        console.error('Invalid response format. Expected an array.');
        setError('Invalid response format. Expected an array.');
      }
    } catch (error) {
      console.error('Error fetching emojis:', error);
      setError('Error fetching emojis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever the component mounts or when the searchQuery changes
  fetchData();
  setDisplayCount(5); // Reset display count to default when a new search is initiated
}, [searchQuery, apiKey, displayCount]);


  const handleShowMore = () => {
    setDisplayCount((prevCount) => Math.min(prevCount + 5, emojis.length));
  };

  const handleShowLess = () => {
    setDisplayCount((prevCount) => Math.max(prevCount - 5, 4, 3, 2, 1));
  };

  const fetchEmojis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
  
      const response = await axios.get(
        `https://emoji-api.com/emojis?search=${searchQuery}&access_key=${apiKey}`
      );
  
      console.log('API Response:', response.data);
      console.log('Search Query:', searchQuery);
  
      if (Array.isArray(response.data)) {
        const filteredEmojis = filterEmojis(response.data, searchQuery);
        console.log('Filtered Emojis:', filteredEmojis);
  
        if (filteredEmojis.length === 0) {
          console.error('No emojis found.');
          setEmojis([]);
          setDisplayedEmojis([]);
          setError('No emojis found.');
        } else {
          setEmojis(filteredEmojis);
          setDisplayedEmojis(filteredEmojis.slice(0, displayCount));
        }
      } else {
        console.error('Invalid response format. Expected an array.');
        setError('Invalid response format. Expected an array.');
      }
    } catch (error) {
      console.error('Error fetching emojis:', error);
      setError('Error fetching emojis. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, apiKey, displayCount, setEmojis, setDisplayedEmojis, setError]);

  const filterEmojis = (emojis, query) => {
    const filteredEmojis = emojis.filter((emoji) => {
      const emojiName = emoji.unicodeName.toLowerCase();
      const queryName = query.toLowerCase();
      return emojiName.includes(queryName);
    });
    return filteredEmojis;
  };

  useEffect(() => {
    // Check if the search query is not empty before fetching emojis
    if (searchQuery.trim() !== '') {
      fetchEmojis();
    }
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
          value={searchQueryInput}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading emojis...</p>
      ) : (
        <div>
          <p className="emoji-info">
            Displaying {Math.min(displayCount, emojis.length)} of {emojis.length} emojis{' '}
          </p>
          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <ul className="emoji-list">
              {displayedEmojis.map((emoji) => (
                <li key={emoji.slug}>
                  <span>Emoji: </span>
                  <span>{emoji.character}</span>
                  <span> Name: </span>
                  <span>{emoji.unicodeName}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="button-container">
            <button onClick={handleShowMore}>Show More</button>{' '}
            <button onClick={handleShowLess}>Show Less</button>
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
