import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ConsultantMyChattingSection.css';

const ConsultantMyChattingSection = () => {
  const [chattingHistory, setChattingHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChattingHistory(currentPage);
  }, [currentPage]);

  const fetchChattingHistory = async (page) => {
    try {
      const response = await fetch(`/api/consultant/my-chatting?page=${page}&size=5`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const myChatting = data.contents?.[0]?.myChatting || [];
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

  const handleChatClick = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="consultant-my-chatting-section">
      <h3>나의 상담 내역</h3>
      <table>
        <thead>
          <tr>
            <th>상담 대상</th>
            <th>상태</th>
            <th>마지막 활동일</th>
            <th>상태 상세</th>
          </tr>
        </thead>
        <tbody>
          {chattingHistory.length > 0 ? (
            chattingHistory.map((chat) => (
              <tr key={chat.id}>
                <td>{chat.other || '-'}</td>
                <td>{chat.status === 'COMPLETED' ? '상담 완료' : '상담 진행 중'}</td>
                <td>{chat.lastActivityAt || '-'}</td>
                <td>
                  {chat.status === 'COMPLETED' ? (
                    '상담 종료됨'
                  ) : (
                    <button
                      onClick={() => handleChatClick(chat.id)}
                      className="ongoing-chat-button"
                    >
                      상담 진행 중
                    </button>
                  )}
                </td>
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
