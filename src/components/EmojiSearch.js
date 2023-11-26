// EmojiSearch component handles emoji search functionality
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import EmojiList from './EmojiList';
import SearchForm from './SearchForm';

const EmojiSearch = ({ searchQuery, setSearchQuery, apiKey }) => {
  // State variables
  const [emojis, setEmojis] = useState([]);
  const [displayedEmojis, setDisplayedEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(5);
  const [error, setError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Event handler for updating search query state
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Event handler for form submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
  };

  // Fetch emojis from the API using useCallback to memorize the function
  const fetchEmojis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Construct the API URL based on the search query and API key
      let apiUrl = `https://emoji-api.com/emojis?access_key=${apiKey}`;
      if (searchQuery.trim() !== '') {
        apiUrl += `&search=${searchQuery}`;
      }

      // Make the API request using Axios
      const response = await axios.get(apiUrl);

      // Log the API response for debugging
      console.log('API Response:', response.data);
      console.log('Search Query:', searchQuery);

      // Process the API response
      if (Array.isArray(response.data)) {
        const filteredEmojis = filterEmojis(response.data, searchQuery);

        // Log filtered emojis for debugging
        console.log('Filtered Emojis:', filteredEmojis);

        // Handle case when no emojis are found
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
      // Handle errors during API request
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

  // Effect to fetch emojis when the form is submitted
  useEffect(() => {
    if (formSubmitted) {
      fetchEmojis();
      setFormSubmitted(false);
    }
  }, [formSubmitted, fetchEmojis, searchQuery, apiKey]);

  // Effect to update displayed emojis when display count changes
  useEffect(() => {
    setDisplayedEmojis(emojis.slice(0, displayCount));
  }, [displayCount, emojis]);

  // Event handler to show more emojis
  const handleShowMore = () => {
    setDisplayCount((prevCount) => Math.min(prevCount + 5, emojis.length));
  };

  // Event handler to show fewer emojis
  const handleShowLess = () => {
    setDisplayCount((prevCount) => Math.max(prevCount - 5, 4, 3, 2, 1));
  };

  // JSX structure for the EmojiSearch component
  return (
    <div>
      <SearchForm
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
      />
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