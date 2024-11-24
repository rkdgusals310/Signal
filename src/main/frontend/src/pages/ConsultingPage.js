import React, { useState, useEffect } from 'react';
import './ConsultingPage.css';
import ConsultingSection from '../components/ConsultingSection';
import { useNavigate } from 'react-router-dom';

const ConsultingPage = () => {
  const [consultants, setConsultants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 5;
  const navigate = useNavigate();

  // Fetch consultant list
  useEffect(() => {
    fetchConsultants();
  }, [searchQuery, genderFilter, currentPage]);

  const fetchConsultants = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/common/consultant/search?search=${encodeURIComponent(
          searchQuery
        )}&gender=${genderFilter}&page=${currentPage}&size=${size}`
      );

      if (response.ok) {
        const data = await response.json();
        setConsultants(data.consultants || []);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0); // 검색 시 페이지 초기화
    fetchConsultants();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChatStart = async (consultantId, consultantName) => {
    try {
      const response = await fetch('/api/auth/chat/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, // 로그인된 유저 ID로 대체 필요
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

  return (
    <div className="consulting-page">
      {/* Consulting Section Slider */}
      <ConsultingSection />

      {/* Filters and Consultant List */}
      <div className="consulting-page-content">
        {/* Search Filters */}
        <div className="search-filters">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상담사 검색"
              className="search-box"
            />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="gender-filter"
            >
              <option value="">성별 선택</option>
              <option value="MALE">남자</option>
              <option value="FEMALE">여자</option>
            </select>
            <button type="submit" className="search-button">
              검색
            </button>
          </form>
        </div>

        {/* Consultant List */}
        <div className="consultant-list">
          {loading && <p>로딩 중...</p>}
          {error && <p>{error}</p>}
          {consultants.length > 0 ? (
            consultants.map((consultant) => (
              <div key={consultant.id} className="consultant-item">
                <img
                  src={consultant.image || '/img/userDefaultImg.png'}
                  alt={consultant.name}
                  className="consultant-image"
                />
                <div className="consultant-info">
                  <h3>{consultant.name}</h3>
                  <p>전문 분야: {consultant.keyword.join(', ')}</p>
                  <p>총 평점: {consultant.totalRating}</p>
                  <p>상담 횟수: {consultant.chattingCount}</p>
                </div>
                <button
                  className="chat-button"
                  onClick={() => handleChatStart(consultant.id, consultant.name)}
                >
                  상담 채팅 바로가기
                </button>
              </div>
            ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>

        {/* Pagination */}
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
    </div>
  );
};

export default ConsultingPage;
