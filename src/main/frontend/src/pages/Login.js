import React, { useState } from 'react';
import './Login.css'; // 외부 스타일 시트로 분리
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 추가

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 로고 클릭 시 홈으로 이동하는 함수
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      {/* 로고 클릭 시 홈으로 이동 */}
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src="/img/loginLogo.png" alt="Signal Logo" /> {/* 로고 이미지 추가 */}
      </div>
      <form className="login-form" action="/login" method="POST">
        <input
          id="userId"
          type="text"
          name="userId"
          placeholder="아이디를 입력해주세요."
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          id="password"
          type="password"
          name="password"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="login-button">로그인</button>
      </form>
      <div className="login-links">
        <a href="/select-user-type">회원가입</a>
        <a href="/find-id">아이디 찾기</a>
        <a href="/find-password">비밀번호 찾기</a>
      </div>
    </div>
  );
};

export default Login;