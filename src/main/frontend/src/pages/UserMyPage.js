import React from 'react';
import UserProfileSection from '../components/UserProfileSection';
import MyPostsSection from '../components/UserMyPostsSection';
import MyLikesSection from '../components/UserMyLikesSection';
import MyCommentsSection from '../components/UserMyCommentsSection';
import MyChattingSection from '../components/UserMyChattingSection';
import './UserMyPage.css';

const UserMyPage = () => {
  return (
    <div className="user-my-page">
      <UserProfileSection />
      <div className="user-page-sections">
        <MyPostsSection />
        <MyLikesSection />
        <MyCommentsSection />
        <MyChattingSection />
      </div>
    </div>
  );
};

export default UserMyPage;
