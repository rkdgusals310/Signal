import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserTypeSelection.css';

const UserTypeSelection = () => {
  const navigate = useNavigate();

  // 일반 사용자를 클릭하면 회원가입 페이지로 이동
  const handleGeneralUserClick = () => {
    navigate('/signup');
  };

  // 전문가를 클릭했을 때 (추후에 전문가 페이지 경로로 변경 필요)
  const handleConsultantClick = () => {
    navigate('/consultant-signup');
  };

  // 로고 클릭 시 홈으로 이동하는 함수
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="user-type-selection-container">
      {/* 로고 클릭 시 홈으로 이동 */}
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src="/img/loginLogo.png" alt="Signal Logo" />
      </div>
      <div className="user-type-options">
        <div className="user-option" onClick={handleGeneralUserClick}>
          <img src="/img/generalUserIcon.png" alt="일반 사용자" />
          <p>일반사용자</p>
        </div>
        <div className="user-option" onClick={handleConsultantClick}>
          <img src="/img/consultantIcon.png" alt="전문가(상담사)" />
          <p>전문가(상담사)</p>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
