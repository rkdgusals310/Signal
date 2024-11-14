// src/pages/CommunityPage.js
import React, { useEffect }  from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityNavigation from '../components/CommunityNavigation';
import './CommunityPage.css';

const CommunityPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/community/gomin/10');
  }, [navigate]);
  
  return (
    <div className="community-page">
      <CommunityNavigation />
      <div className="community-content">
        <h2>게시판을 선택하세요</h2>
      </div>
    </div>
  );
};

export default CommunityPage;
