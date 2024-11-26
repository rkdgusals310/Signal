import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get('search') || '';
  const size = 5;

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      fetchSearchResults(initialSearchQuery, 0);
    }
  }, [initialSearchQuery]);

  const fetchSearchResults = async (search, page) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/common/post/search?search=${encodeURIComponent(search)}&size=${size}&page=${page}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data.contents[0]?.posts || []);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        setError('검색 결과를 가져오지 못했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchSearchResults(searchQuery, page);
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search-results?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="search-results-page">
      <div className="search-results-header">
        <FaSearch className="search-result-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          onKeyDown={handleSearchKeyDown}
          className="search-results-input"
          placeholder="검색어를 입력해주세요."
        />
      </div>
      {loading && <p>로딩 중...</p>}
      {error && <p>{error}</p>}
      {results.length > 0 ? (
        <>
          <ul>
            {results.map((post) => (
              <li
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="search-result-item"
              >
                <h2>{post.title}</h2>
                <p>{post.contents}</p>
                <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
                <p>조회수: {post.viewCount}, 좋아요: {post.likesCount}, 댓글: {post.commentsCount}</p>
              </li>
            ))}
          </ul>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx)}
                disabled={idx === currentPage}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;
