import React from 'react';
import UserProfileSection from '../components/UserProfile/UserProfileSection';
import MyPostsSection from '../components/UserProfile/UserMyPostsSection';
import MyLikesSection from '../components/UserProfile/UserMyLikesSection';
import MyCommentsSection from '../components/UserProfile/UserMyCommentsSection';
import MyChattingSection from '../components/UserProfile/UserMyChattingSection';
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
