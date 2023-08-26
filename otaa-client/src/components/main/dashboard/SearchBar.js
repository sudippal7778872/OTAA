// components/SearchBar.js
import React from 'react';
import './SearchBar.css'; 
import { Search } from '@mui/icons-material';

const SearchBar = ({ placeholder, onSearch }) => {
  return (
    <div className="search-container">
      <input type="text" className="search-bar" placeholder={placeholder} />
      <button className="search-button" onClick={onSearch}>
      <Search />
      </button>
    </div>
  );
};

export default SearchBar;
