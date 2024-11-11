import React, { useState } from 'react';
import './SearchBar.css';
import { FaSearch } from 'react-icons/fa'; //React Icons 패키지

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log('검색어:', query);
  };

  // Enter 키검색
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-icon">
        <FaSearch />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown} // Enter 키로 검색
        placeholder="검색어를 입력해주세요."
      />
    </div>
  );
};

export default SearchBar;
