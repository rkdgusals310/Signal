import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    const userRole = sessionStorage.getItem('role');
    if (userRole) {
      setRole(userRole);
    }
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      const confirmLogout = window.confirm('정말 로그아웃하시겠습니까?');
      if (confirmLogout) {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('role');
        setIsLoggedIn(false);
        navigate('/');
      }
    } else {
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
              <Link to={role === 'USER' ? '/usermypage' : '/consultantmypage'}>
                Mypage
              </Link>
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
