// src/components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <img src="/img/footerLogo.png" alt="Logo" className="footer-logo" />
        </div>
        <div className="footer-center">
          <p>&copy; All Rights Reserved</p>
        </div>
        <div className="footer-right">
          <a href="mailto:kk104202@naver.com">
            <img src="/img/footerEmail.png" alt="Email" className="social-icon" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="/img/footerInstagram.png" alt="Instagram" className="social-icon" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="/img/footerTwitter.png" alt="Twitter" className="social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
