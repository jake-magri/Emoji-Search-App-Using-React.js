import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import EmojiList from './EmojiList';

const EmojiSearch = ({ searchQuery, setSearchQuery, apiKey }) => {
  const [emojis, setEmojis] = useState([]);
  const [displayedEmojis, setDisplayedEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(5);
  const [error, setError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false); // Added state for form submission

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
  };

  const fetchEmojis = useCallback(async () => {
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

  const filterEmojis = (emojis, query) => {
    const filteredEmojis = emojis.filter((emoji) => {
      const emojiName = emoji.unicodeName.toLowerCase();
      const queryName = query.toLowerCase();
      return emojiName.includes(queryName);
    });
    return filteredEmojis;
  };

  useEffect(() => {
    if (formSubmitted) {
      fetchEmojis();
      setFormSubmitted(false);
    }
  }, [formSubmitted, fetchEmojis]);

  useEffect(() => {
    fetchEmojis();
    setDisplayCount(5);
  }, [searchQuery, apiKey, fetchEmojis]);

  useEffect(() => {
    setDisplayedEmojis(emojis.slice(0, displayCount));
  }, [displayCount, emojis]);

  const handleShowMore = () => {
    setDisplayCount((prevCount) => Math.min(prevCount + 5, emojis.length));
  };

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
