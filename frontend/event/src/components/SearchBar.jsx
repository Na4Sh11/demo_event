// SearchBar.js
import React from 'react';

const SearchBar = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search for events..."
      />
      <button onClick={onSearchSubmit}>Search</button>
    </div>
  );
};

export default SearchBar;
