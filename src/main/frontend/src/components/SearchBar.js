import React, { useState } from 'react';
import './SearchBar.css';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search-results?search=${encodeURIComponent(query.trim())}`);
    } else {
      alert('검색어를 입력해주세요.');
    }
  };

  // Enter 키 검색
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
