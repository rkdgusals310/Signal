// src/pages/InfoDetailPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import CommunityNavigation from '../components/CommunityNavigation'; // 네비게이션 추가

const InfoDetailPage = () => {
  const { category } = useParams(); // URL 파라미터로 받은 카테고리

  return (
    <div className="community-page">
      <CommunityNavigation /> {/* 네비게이션 표시 */}
      <div className="community-content">
        <h2>{category} 정보 게시판</h2>
        {/* 해당 카테고리의 정보를 렌더링 */}
      </div>
    </div>
  );
};

export default InfoDetailPage;
