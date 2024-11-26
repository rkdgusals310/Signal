import React from 'react';
import ConsultantProfileSection from '../components/ConsultantProfile/ConsultantProfileSection';
import ConsultantMyArticlesSection from '../components/ConsultantProfile/ConsultantMyArticlesSection';
import ConsultantMyLikesSection from '../components/ConsultantProfile/ConsultantMyLikesSection';
import ConsultantMyCommentsSection from '../components/ConsultantProfile/ConsultantMyCommentsSection';
import ConsultantMyChattingSection from '../components/ConsultantProfile/ConsultantMyChattingSection';
import './ConsultantMyPage.css';

const ConsultantMyPage = () => {
  return (
    <div className="consultant-my-page">
      <ConsultantProfileSection />
      <div className="consultant-page-sections">
        <ConsultantMyArticlesSection />
        <ConsultantMyLikesSection />
        <ConsultantMyCommentsSection />
        <ConsultantMyChattingSection />
      </div>
    </div>
  );
};

export default ConsultantMyPage;
