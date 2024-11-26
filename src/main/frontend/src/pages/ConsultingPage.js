import React, { useState, useEffect } from 'react';
import './ConsultingPage.css';
import ConsultingSection from '../components/ConsultingSection';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import likeBefore from '../assets/like-before.png';
import likeAfter from '../assets/like-after.png';

const ConsultingPage = () => {
  const [consultants, setConsultants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [likeStates, setLikeStates] = useState({}); // 좋아요 상태 관리
  const size = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsultants();
  }, [searchQuery, genderFilter, currentPage]);

  const fetchConsultants = async () => {
    setLoading(true);
    setError(null);

    const baseUrl = searchQuery || genderFilter
      ? `/api/common/consultant/search`
      : `/api/common/consultant`;

    const params = new URLSearchParams({
      search: searchQuery || '',
      gender: genderFilter || '',
      page: currentPage,
      size,
    });

    try {
      const response = await fetch(`${baseUrl}?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        const consultantData =
          searchQuery || genderFilter
            ? data.contents || []
            : data.contents[0]?.consultants || [];

        setConsultants(consultantData);

        // 좋아요 초기 상태 설정
        const initialLikeStates = consultantData.reduce((acc, consultant) => {
          acc[consultant.id] = consultant.isLiked ? likeBefore : likeAfter;
          return acc;
        }, {});
        setLikeStates(initialLikeStates);

        setTotalPages(data.totalPages || 0);
      } else {
        setError('상담사 목록을 가져오지 못했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const handleGenderFilterChange = (e) => {
    setGenderFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleChatStart = async (consultantId, consultantName) => {
    try {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const response = await fetch('/api/auth/chat/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          consultantId,
        }),
      });

      if (response.ok) {
        const { roomId } = await response.json();
        navigate(`/chat/${roomId}`, { state: { consultantName } });
      } else {
        alert('상담 채팅방을 생성할 수 없습니다.');
      }
    } catch (error) {
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  const handleWishClick = async (consultantId) => {
    try {
      const currentState = likeStates[consultantId];
      const newState = currentState === likeAfter ? likeBefore : likeAfter;

      await fetch(`/api/user/consultant/${consultantId}/wish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      setLikeStates((prev) => ({
        ...prev,
        [consultantId]: newState,
      }));
    } catch (err) {
      alert('위시리스트 추가/삭제 중 오류가 발생했습니다.');
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    return (
      <>
        {Array(fullStars)
          .fill('★')
          .map((_, idx) => (
            <span key={`full-${idx}`} className="star full">
              ★
            </span>
          ))}
        {halfStar === 1 && (
          <span className="star half" key="half">
            ☆
          </span>
        )}
      </>
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="consulting-page">
      <ConsultingSection />

      <div className="consulting-page-content">
        <div className="search-filters">
          <div className="search-box-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="상담사 검색"
              className="search-box"
            />
          </div>
          <div className="gender-filter">
            <span>성별 선택</span>
            <label>
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={genderFilter === 'MALE'}
                onChange={handleGenderFilterChange}
              />
              남자
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={genderFilter === 'FEMALE'}
                onChange={handleGenderFilterChange}
              />
              여자
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value=""
                checked={genderFilter === ''}
                onChange={handleGenderFilterChange}
              />
              무관
            </label>
          </div>
        </div>

        <div className="consultant-list">
          <p>총 {consultants.length}명의 상담사가 검색되었습니다.</p>
          {loading && <p>로딩 중...</p>}
          {error && <p>{error}</p>}
          {consultants.length > 0 ? (
            consultants.map((consultant) => (
              <div key={consultant.id} className="consultant-item">
                <img
                  src={likeStates[consultant.id]}
                  alt="like"
                  className="like-icon"
                  onClick={() => handleWishClick(consultant.id)}
                />
                <img
                  src={consultant.image || '/img/userDefaultImg.png'}
                  alt={consultant.name}
                  className="consultant-image"
                />
                <div className="consultant-info">
                  <h3>{consultant.name}</h3>
                  <p>전문 분야: {consultant.keyword}</p>
                  <p>총 평점: {renderStars(consultant.totalRating || 0)}</p>
                  <p>상담 횟수: {consultant.chattingCount}</p>
                </div>
                <button
                  className="chat-button"
                  onClick={() =>
                    handleChatStart(consultant.id, consultant.name)
                  }
                >
                  상담 채팅 바로가기
                </button>
              </div>
            ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>        
      </div>
      <div className="pagination">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx)}
              disabled={idx === currentPage}
              className={idx === currentPage ? 'active' : ''}
            >
              {idx + 1}
            </button>
          ))}
        </div>
    </div>
  );
};

export default ConsultingPage;
