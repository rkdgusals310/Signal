// src/components/FooterLogin.js
import React from 'react';
import './FooterLogin.css';

const Footer = () => {
  return (
    <footer className="footerLogin">
      <div className="footerLogin-content">
        <div className="footerLogin-left">
          <img src="/img/footerLoginLogo.png" alt="Logo" className="footerLogin-logo" />
        </div>
        <div className="footerLogin-center">
          <p>&copy; All Rights Reserved</p>
        </div>
        <div className="footerLogin-right">
          <a href="mailto:kk104202@naver.com">
            <img src="/img/footerEmail.png" alt="Email" className="social-iconLogin" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="/img/footerInstagram.png" alt="Instagram" className="social-iconLogin" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="/img/footerTwitter.png" alt="Twitter" className="social-iconLogin" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
