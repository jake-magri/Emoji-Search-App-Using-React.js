// SearchForm component renders a form for searching emojis
import React from 'react';

const SearchForm = ({ searchQuery, handleSearchChange, handleSearchSubmit }) => {
  // Handler function to update search query when input changes
  const handleChange = (event) => {
    // Call the provided handleSearchChange function
    handleSearchChange(event);
  };

  // Handler function for form submission
  const handleSubmit = (event) => {
    // Prevent default form submission behavior
    event.preventDefault();
    // Call the provided handleSearchSubmit function
    handleSearchSubmit(event);
  };

  return (
    // Render a form with an input field and a search button
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search emojis"
        value={searchQuery}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchForm;
