// src/pages/CommunityPage.js
import React from 'react';
import CommunityNavigation from '../components/CommunityNavigation';
import './CommunityPage.css';

const CommunityPage = () => {
  return (
    <div className="community-page">
      <CommunityNavigation />
      <div className="community-content">
        <h2>게시판을 선택하세요</h2>
        {/* 세부 카테고리 선택 후 페이지 콘텐츠가 여기에 나타남 */}
      </div>
    </div>
  );
};

export default CommunityPage;
