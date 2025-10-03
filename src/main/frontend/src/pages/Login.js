import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. 로그인 요청
      const response = await fetch('/loginProc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ userId, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
        return;
      }
      sessionStorage.setItem('isLoggedIn', 'true');

      const meResponse = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (meResponse.ok) {
        const userInfo = await meResponse.json();
        sessionStorage.setItem('userId', userInfo.id);
        sessionStorage.setItem('role', userInfo.role);
        console.log('로그인 성공:', userInfo);
      } else {
        console.warn('로그인 성공했지만 사용자 정보를 가져오지 못했습니다.');
      }

      navigate('/');

    } catch (error) {
      console.error('로그인 요청 오류:', error);
      setError('서버 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-page-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src="/img/loginLogo.png" alt="Signal Logo" />
      </div>
      <form className="login-page-form" onSubmit={handleLogin}>
        <input
          id="userId"
          type="text"
          name="userId"
          placeholder="아이디를 입력해주세요."
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          id="password"
          type="password"
          name="password"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-page-button">로그인</button>
      </form>
      {error && <p className="login-page-error-message">{error}</p>}

      <div className="login-page-links">
        <a href="/select-user-type">회원가입</a>
        <a href="/find-id">아이디 찾기</a>
        <a href="/find-password">비밀번호 찾기</a>
      </div>
    </div>
  );
};

export default Login;
