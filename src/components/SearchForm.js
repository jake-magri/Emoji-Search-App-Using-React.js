// components/SearchForm.js
import React from 'react';

const SearchForm = ({ searchQuery, handleSearchChange, handleSearchSubmit }) => {
  const handleChange = (event) => {
    handleSearchChange(event);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearchSubmit();
  };

  return (
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
