import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryInput, setSearchQueryInput] = useState('');
  const [emojis, setEmojis] = useState([]);
  const [displayedEmojis, setDisplayedEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(5);
  const [error, setError] = useState(null);

  // API key for emoji API
  const apiKey = '84fac0f20066123921007d0d48bac464759a4647';

  // Handler for input change in the search bar
  const handleSearchChange = (event) => {
    setSearchQueryInput(event.target.value);
  };

  // Handler for form submission
  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    setSearchQuery(searchQueryInput);
  };

  // Memoized function to fetch emojis based on search query
  const fetchEmojis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build the API URL
      let apiUrl = `https://emoji-api.com/emojis?access_key=${apiKey}`;
      if (searchQuery.trim() !== '') {
        apiUrl += `&search=${searchQuery}`;
      }

      // Fetch data using Axios
      const response = await axios.get(apiUrl);

      console.log('API Response:', response.data);
      console.log('Search Query:', searchQuery);

      // Handle the API response
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
        }
      } else if (typeof response.data === 'object') {
        console.log('User query did not yield any matches.');
        setEmojis([]);
        setDisplayedEmojis([]);
        setError('No emojis found.');
      } else {
        console.error('Invalid response format. Expected an array.');
        console.log('Actual Type of API Response:', typeof response.data);
        console.log('Actual API Response:', response.data);
        setError('Invalid response format. Expected an array.');
      }
    } catch (error) {
      console.error('Error fetching emojis:', error);
      setError('Error fetching emojis. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, apiKey, setEmojis, setError]);

  // Function to filter emojis based on search query
  const filterEmojis = (emojis, query) => {
    const filteredEmojis = emojis.filter((emoji) => {
      const emojiName = emoji.unicodeName.toLowerCase();
      const queryName = query.toLowerCase();
      return emojiName.includes(queryName);
    });
    return filteredEmojis;
  };

  // Effect to fetch data from the emoji API when searchQuery, apiKey, or displayCount changes
  useEffect(() => {
    // Fetch data whenever the component mounts or when the searchQuery changes
    fetchEmojis();
    // Reset display count to default when a new search is initiated
    setDisplayCount(5);
  }, [searchQuery, apiKey, fetchEmojis]);

  // Effect to update displayed emojis whenever displayCount or emojis changes
  useEffect(() => {
    // Update displayed emojis based on the current displayCount
    setDisplayedEmojis(emojis.slice(0, displayCount));
  }, [displayCount, emojis]);

  // Handler for "Show More" button
  const handleShowMore = () => {
    // Update displayCount to show more emojis
    setDisplayCount((prevCount) => Math.min(prevCount + 5, emojis.length));
  };

  // Handler for "Show Less" button
  const handleShowLess = () => {
    // Update displayCount to show fewer emojis
    setDisplayCount((prevCount) => Math.max(prevCount - 5, 4, 3, 2, 1));
  };

  // Render the component
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
