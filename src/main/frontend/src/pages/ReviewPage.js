import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ReviewPage.css';

const ReviewPage = () => {
  const { roomId } = useParams(); // 채팅방 ID 가져오기
  const navigate = useNavigate();

  // API로 받아온 데이터 상태
  const [reviewInfo, setReviewInfo] = useState(null);
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviewPageData();
  }, []);

  const fetchReviewPageData = async () => {
    try {
      const response = await fetch(`/api/auth/chat/room/${roomId}/review-page`);
      if (response.ok) {
        const data = await response.json();
        setReviewInfo(data);
      } else {
        setError('리뷰 페이지 정보를 불러오지 못했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleReviewSubmit = async () => {
    try {
      const response = await fetch(`/api/auth/chat/room/${roomId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          content: reviewContent,
        }),
      });

      if (response.ok) {
        alert('리뷰가 성공적으로 작성되었습니다.');
        navigate('/'); // 리뷰 작성 후 홈으로 이동
      } else {
        setError('리뷰 작성에 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    }
  };

  if (!reviewInfo) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="review-page">
      <button className="review-back-button" onClick={() => navigate(-1)}>
        &lt;
      </button>
      <h1>상담사 리뷰</h1>
      <div className="review-header">
        <img src={reviewInfo.profileImage || '/placeholder.png'} alt="프로필" className="review-profile-image" />
        <div className="review-info">
          <h2>{reviewInfo.consultantName}</h2>
          <span className="keyword">{reviewInfo.keyword}</span>
          <span className="style">{reviewInfo.style}</span>
          <span className="rating">평균 평점: {reviewInfo.averageRating.toFixed(2)} / 5</span>
        </div>
      </div>
      <div className="review-form">
        <div className="rating-input">
          <p>평점을 선택해주세요</p>
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              className={`star ${value <= rating ? 'selected' : ''}`}
              onClick={() => handleRatingChange(value)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder="리뷰를 작성해주세요."
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
        />
        <button onClick={handleReviewSubmit} className="review-submit-button">
          리뷰 작성
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ReviewPage;
