import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ConsultantProfilePage.css';

const ConsultantProfilePage = () => {
  const { consultantId } = useParams();
  const navigate = useNavigate();

  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userRole = sessionStorage.getItem('role'); // 세션스토리지에서 role 가져오기

  useEffect(() => {
    const fetchConsultantProfile = async () => {
      try {
        const response = await fetch(`/api/common/consultant/${consultantId}`);
        if (response.ok) {
          const data = await response.json();
          setConsultant(data);
        } else {
          setError('상담사 정보를 불러오지 못했습니다.');
        }
      } catch (err) {
        setError('네트워크 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultantProfile();
  }, [consultantId]);

  const handleChatClick = async () => {
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
        body: JSON.stringify({ userId, consultantId }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/chat/${data.roomId}`, { state: { consultantName: consultant.name } });
      } else {
        alert('상담방을 생성할 수 없습니다.');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="consultant-profile-page">
      <div className="consultant-profile-header">
        <button onClick={() => navigate(-1)} className="consultant-profile-back-button">
          &lt;
        </button>
        <h1 className="consultant-title">{consultant.name} 상담사 프로필</h1>
      </div>

      <div className="consultant-main-info">
        <img
          src={consultant.profileImage || '/img/userDefaultImg.png'}
          alt={consultant.name}
          className="consultant-profile-image"
        />
        <div className="consultant-details">
          <h2>{consultant.name}</h2>
          <div className="consultant-summary">
            <div className="consultant-summary-item">
              <strong>대표 키워드</strong>
              <p>{consultant.keyword || '정보 없음'}</p>
            </div>
            <div className="consultant-summary-item">
              <strong>상담 가능일</strong>
              <p>{consultant.availableDays || '정보 없음'}</p>
            </div>
            <div className="consultant-summary-item">
              <strong>리뷰 점수</strong>
              <p>
                {Array(Math.floor(consultant.totalRating))
                  .fill('★')
                  .join('')}
                {consultant.totalRating % 1 >= 0.5 ? '☆' : ''}
              </p>
            </div>
          </div>
          {userRole !== 'CONSULTANT' && (
            <button className="chat-button" onClick={handleChatClick}>
              상담 채팅 바로가기
            </button>
          )}
        </div>
      </div>

      <div className="consultant-extra-info">
        <h3>상담사 소개</h3>
        <p>{consultant.profile || '정보 없음'}</p>

        <h3>공인 자격 및 경력</h3>
        <p>{consultant.certifiedQualification || '정보 없음'}</p>

        <h3>기타 경력</h3>
        <p>{consultant.experience || '정보 없음'}</p>
      </div>

      {/* Review Slider */}
      <ReviewSlider reviewList={consultant.reviewList} />

      {/* Article Slider */}
      <ArticleSlider articleList={consultant.articleList} />
    </div>
  );
};

// 리뷰 슬라이더 컴포넌트
const ReviewSlider = ({ reviewList }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getVisibleSlides = () => {
    if (!reviewList.length) return [];
    let visibleSlides = [];
    const maxSlides = Math.min(reviewList.length, 3);
    for (let i = 0; i < maxSlides; i++) {
      visibleSlides.push(reviewList[(currentIndex + i) % reviewList.length]);
    }
    return visibleSlides;
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviewList.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviewList.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="slider">
      {reviewList.length === 0 ? (
        <p>리뷰가 없습니다.</p>
      ) : (
        <div className="slider-container">
          <button className="slider-button prev" onClick={prevSlide}>
            &#10094;
          </button>
          <div className="slider-section">
            {getVisibleSlides().map((review) => (
              <div key={review.reviewId} className="slider-item">
                <p>
                  <strong>{review.userName}님 상담 후기</strong>
                </p>
                <p>
                  {Array(Math.floor(review.rating))
                    .fill('★')
                    .join('')}
                  {review.rating % 1 >= 0.5 ? '☆' : ''}
                </p>
                <p>{review.content}</p>
              </div>
            ))}
          </div>
          <button className="slider-button next" onClick={nextSlide}>
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
};

// ArticleSlider 컴포넌트
// ArticleSlider 컴포넌트
// ArticleSlider 컴포넌트
const ArticleSlider = ({ articleList }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const getVisibleSlides = () => {
    if (!articleList.length) return [];
    let visibleSlides = [];
    const maxSlides = Math.min(articleList.length, 3);
    for (let i = 0; i < maxSlides; i++) {
      visibleSlides.push(articleList[(currentIndex + i) % articleList.length]);
    }
    return visibleSlides;
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articleList.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? articleList.length - 1 : prevIndex - 1
    );
  };

  const handleArticleClick = (articleId) => {
    navigate(`/article`);
  };

  return (
    <div className="slider">
      {articleList.length === 0 ? (
        <p>아티클이 없습니다.</p>
      ) : (
        <div className="slider-container">
          <button className="slider-button prev" onClick={prevSlide}>
            &#10094;
          </button>
          <div className="slider-section">
            {getVisibleSlides().map((article, index) => (
              <div key={index} className="slider-item">
                <img src={article.thumbnail} alt={article.title} className="article-thumbnail" />
                
                <div className="article-info">
                
  
                  <p className="article-title">{article.title}</p>
                  <button
                    className="article-more-button"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    Article 보러가기
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="slider-button next" onClick={nextSlide}>
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
};



export default ConsultantProfilePage;
