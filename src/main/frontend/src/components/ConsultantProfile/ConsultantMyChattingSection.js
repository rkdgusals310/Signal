import React, { useState, useEffect } from 'react';
import './ConsultantMyChattingSection.css';

const ConsultantMyChattingSection = () => {
  const [chattingHistory, setChattingHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchChattingHistory(currentPage);
  }, [currentPage]);

  const fetchChattingHistory = async (page) => {
    try {
      const response = await fetch(`/api/common/my-chatting?page=${page}&size=5`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const myChatting = data.content?.myChatting || [];
        setChattingHistory(myChatting);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error('채팅 내역 조회 실패:', response.status);
        setChattingHistory([]);
      }
    } catch (error) {
      console.error('채팅 내역을 불러오는 중 오류 발생:', error);
      setChattingHistory([]);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="consultant-my-chatting-section">
      <h3>나의 상담 내역</h3>
      <table>
        <thead>
          <tr>
            <th>상담사</th>
            <th>상태</th>
            <th>시작일</th>
            <th>완료일</th>
          </tr>
        </thead>
        <tbody>
          {chattingHistory.length > 0 ? (
            chattingHistory.map((chat) => (
              <tr key={chat.id}>
                <td>{chat.consultant || '-'}</td>
                <td>{chat.status === 'ongoing' ? '진행 중' : '완료됨'}</td>
                <td>{chat.createdAt?.split('T')[0] || '-'}</td>
                <td>{chat.completedAt ? chat.completedAt.split('T')[0] : '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">상담 내역이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
          &lt; 이전
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index ? 'active' : ''}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage + 1 === totalPages}
        >
          다음 &gt;
        </button>
      </div>
    </div>
  );
};

export default ConsultantMyChattingSection;
