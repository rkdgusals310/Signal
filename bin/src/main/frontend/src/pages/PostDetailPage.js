import React from 'react';
import CommunityNavigation from '../components/CommunityNavigation';
import SinglePost from '../components/SinglePost';
import './PostDetailPage.css';

const PostDetailPage = () => {
  return (
    <div className="post-detail-container">
      <div className="navigation">
        <CommunityNavigation />
      </div>
      <div className="post-comment-container">
        <SinglePost />
      </div>
    </div>
  );
};

export default PostDetailPage;
