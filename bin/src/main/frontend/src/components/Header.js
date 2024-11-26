import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 훅 추가
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      // 로그아웃 처리
      setIsLoggedIn(false);
    } else {
      // 로그인 상태가 아니면 로그인 페이지로 이동
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">
            <img src="/img/mainlogo.png" alt="Signal Logo" className="logo-image" />
          </Link>
        </div>
        
        <nav className="nav-links">
          <Link to="/article">Article</Link>
          <Link to="/community">Community</Link>
          <Link to="/consulting">Consulting</Link>

          {isLoggedIn ? (
            <>
              <Link to="/mypage">Mypage</Link>
              <button onClick={handleLoginLogout}>Logout</button>
            </>
          ) : (
            <button onClick={handleLoginLogout}>Login</button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
