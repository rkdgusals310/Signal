import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ConsultantProfilePage.css';

const ConsultantProfilePage = () => {
  const { consultantId } = useParams();
  const navigate = useNavigate();

  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <p>{consultant.totalRating || '정보 없음'}</p>
            </div>
          </div>
          <button className="chat-button" onClick={handleChatClick}>
            상담 채팅 바로가기
          </button>
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
    </div>
  );
};

export default ConsultantProfilePage;
