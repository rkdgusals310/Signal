import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 로고 클릭 시 홈으로 이동하는 함수
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src="/img/loginLogo.png" alt="Signal Logo" />
      </div>
      <form className="login-form" action="/loginProc" method="POST">
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
