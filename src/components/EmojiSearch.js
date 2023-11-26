import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import EmojiList from './EmojiList';

const EmojiSearch = ({ searchQuery, setSearchQuery }) => {
  // State variables
  const [emojis, setEmojis] = useState([]);
  const [displayedEmojis, setDisplayedEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(5);
  const [error, setError] = useState(null);

  // API key for emoji API
  const apiKey = '84fac0f20066123921007d0d48bac464759a4647';

  // Handler for input change in the search bar
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handler for form submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Form submission logic can be added here if needed
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

      // Logging for debugging
      console.log('API Response:', response.data);
      console.log('Search Query:', searchQuery);

      // Handle the API response
      if (Array.isArray(response.data)) {
        const filteredEmojis = filterEmojis(response.data, searchQuery);

        // Logging for debugging
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
  }, [searchQuery, apiKey]);

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
    setDisplayedEmojis(emojis.slice(0, displayCount));
  }, [displayCount, emojis]);

  // Handler for "Show More" button
  const handleShowMore = () => {
    setDisplayCount((prevCount) => Math.min(prevCount + 5, emojis.length));
  };

  // Handler for "Show Less" button
  const handleShowLess = () => {
    setDisplayCount((prevCount) => Math.max(prevCount - 5, 4, 3, 2, 1));
  };

  return (
    <div>
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
        <EmojiList
          emojis={emojis}
          displayedEmojis={displayedEmojis}
          displayCount={displayCount}
          handleShowMore={handleShowMore}
          handleShowLess={handleShowLess}
          error={error}
        />
      )}
    </div>
  );
};

export default EmojiSearch;
