import React from 'react';
import CommunityWriteForm from '../components/CommunityWriteForm';
import CommunityNavigation from '../components/CommunityNavigation'; // 네비게이션 추가
import './WritePage.css';

const WritePage = () => {
  return (
    <div className="write-page">
      <CommunityNavigation />
      <div className="write-form-container">
        <CommunityWriteForm />
      </div>
    </div>
  );
};

export default WritePage;
