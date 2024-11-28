import React, { useState, useEffect } from 'react';
import './UserMyChattingSection.css';
import { useNavigate } from 'react-router-dom';

const UserMyChattingSection = () => {
  const [chatting, setChatting] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingReviewId, setLoadingReviewId] = useState(null);
  const [reviews, setReviews] = useState({}); // 리뷰 데이터를 캐싱
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyChatting(currentPage);
  }, [currentPage]);

  const fetchMyChatting = async (page) => {
    try {
      const response = await fetch(`/api/user/my-chatting?page=${page}&size=5`);
      if (response.ok) {
        const data = await response.json();
        setChatting(data.contents[0]?.myChatting || []);
      }
    } catch (error) {
      console.error('Error fetching chatting:', error);
    }
  };

  const fetchReviewDetail = async (reviewId) => {
    try {
      setLoadingReviewId(reviewId); // 로딩 상태 표시
      const response = await fetch(`/api/common/consultant/reviewDetail?reviewId=${reviewId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews((prev) => ({
          ...prev,
          [reviewId]: data.content, // 리뷰 내용을 캐싱
        }));
      }
    } catch (error) {
      console.error('Error fetching review detail:', error);
    } finally {
      setLoadingReviewId(null); // 로딩 상태 해제
    }
  };

  return (
    <div className="user-my-chatting-section">
      <h3>전문가 상담 내역 확인</h3>
      <table>
        <thead>
          <tr>
            <th>상담사 이름</th>
            <th>마지막 활동일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {chatting.map((chat) => (
            <tr key={chat.id}>
              <td>{chat.other}</td>
              <td>{chat.lastActivityAt}</td>
              <td>
                {chat.status === 'ACTIVE' ? (
                  <button
                    onClick={() => navigate(`/chat/${chat.id}`)}
                    className="chat-progress-button"
                  >
                    상담 진행 중
                  </button>
                ) : (
                  <div>
                    {loadingReviewId === chat.reviewId ? (
                      <p>로딩 중...</p>
                    ) : reviews[chat.reviewId] ? (
                      <p>{reviews[chat.reviewId]}</p>
                    ) : (
                      <button
                        onClick={() => fetchReviewDetail(chat.reviewId)}
                        className="view-review-button"
                      >
                        작성한 리뷰 보기
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          이전
        </button>
        <span>페이지 {currentPage + 1}</span>
        <button onClick={() => setCurrentPage((prev) => prev + 1)}>다음</button>
      </div>
    </div>
  );
};

export default UserMyChattingSection;
